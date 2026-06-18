---
sidebar_position: 4
---

import AvailableSince from '../../_components/AvailableSince';

# @zenstackhq/plugin-soft-delete

<AvailableSince version="v3.8.0" />

The `@zenstackhq/plugin-soft-delete` plugin implements **soft delete** by intercepting Kysely queries at runtime. Instead of physically removing rows, delete operations mark them with a timestamp, and reads automatically exclude the marked rows.

## How It Works

The plugin works off a single `@deletedAt` marker field on each model that should support soft deletion:

- **Deletes become updates** — a `delete`/`deleteMany` against a soft-delete model is rewritten to set the `@deletedAt` field to the current timestamp instead of issuing a `DELETE`.
- **Reads are filtered** — `find*` queries (and joined relations) automatically add a `<deletedAt> IS NULL` condition, so soft-deleted rows are invisible.
- **Updates skip tombstones** — `update`/`updateMany` won't touch rows that are already soft-deleted.

Models without a `@deletedAt` field are left completely untouched.

## Installation

```bash
npm install @zenstackhq/plugin-soft-delete
```

## Usage

### 1. Declare the plugin in your ZModel schema

Declaring the plugin makes the `@deletedAt` attribute available in your schema.

```zmodel
plugin softDelete {
    provider = '@zenstackhq/plugin-soft-delete'
}
```

### 2. Mark a nullable `DateTime` field with `@deletedAt`

A model can have at most one `@deletedAt` field, and it must be optional (so that "not deleted" is represented by `null`).

```zmodel
model User {
    id        Int       @id @default(autoincrement())
    email     String    @unique
    posts     Post[]
    deletedAt DateTime? @deletedAt
}

model Post {
    id        Int       @id @default(autoincrement())
    title     String
    author    User      @relation(fields: [authorId], references: [id])
    authorId  Int
    deletedAt DateTime? @deletedAt
}
```

### 3. Install the plugin on your client at runtime

```ts
import { ZenStackClient } from '@zenstackhq/orm';
import { SoftDeletePlugin } from '@zenstackhq/plugin-soft-delete';
import { schema } from './schema';

const db = new ZenStackClient(schema, { ... }).$use(new SoftDeletePlugin());

const user = await db.user.create({ data: { email: 'a@example.com' } });

// rewritten to set `deletedAt` — the row is kept in the database
await db.user.delete({ where: { id: user.id } });

// returns `null` — soft-deleted rows are hidden from reads
await db.user.findUnique({ where: { id: user.id } });
```

### Works with the query builder APIs

Because the plugin intercepts queries at the Kysely level, soft-delete behavior also applies to the low-level [query builder](../../orm/query-builder.md) escape hatch (`$qb`), not just the ORM API. Deletes are rewritten to `@deletedAt` updates and reads are filtered there too.

```ts
// rewritten to set `deletedAt` instead of issuing a DELETE
await db.$qb.deleteFrom('User').where('id', '=', user.id).execute();

// only returns rows where `deletedAt IS NULL`
await db.$qb.selectFrom('User').selectAll().execute();
```

## ZModel Declarations

### Attributes

#### `@deletedAt`

```zmodel
attribute @deletedAt()
```

Marks the field used as the soft-delete tombstone marker. The field must be an optional `DateTime?`. A model may declare at most one `@deletedAt` field.

## Caveats

- **Soft deletes do not cascade.** Children of a soft-deleted parent are left untouched — managing them is up to you. (Note that a *hard* delete on a model without `@deletedAt` still triggers database-level `onDelete: Cascade` as usual.)
- **Multi-table / joined deletes can't be rewritten.** A joined or multi-table `DELETE` that targets a soft-delete model is rejected rather than silently hard-deleting rows. Use a single-table delete instead.
- **Unique constraints and tombstones.** Because soft-deleted rows physically remain, a plain `@unique` field will reject reusing a value held by a tombstone. See [Reusing unique values](#reusing-unique-values) below for the mitigation.

## Reusing unique values

A `@unique` field in ZModel compiles to a regular database unique constraint that also covers soft-deleted rows. So once a user with `email = "a@example.com"` is soft-deleted, you can't create another user with the same email — the tombstone still occupies that value.

The fix is a **partial (filtered) unique index** scoped to live rows (`deletedAt IS NULL`). ZModel can't express this, so you add it through a **manually created migration**. Generate an empty migration with `--create-only`, then edit its SQL:

```bash
npx zenstack migrate dev --create-only --name soft_delete_unique_email
```

In the generated migration, drop the plain unique constraint and replace it with a partial one. The exact SQL depends on your database:

**PostgreSQL** — supports partial indexes directly:

```sql
CREATE UNIQUE INDEX "User_email_active_key"
  ON "User" ("email")
  WHERE "deletedAt" IS NULL;
```

**SQLite** — also supports partial indexes:

```sql
CREATE UNIQUE INDEX "User_email_active_key"
  ON "User" ("email")
  WHERE "deletedAt" IS NULL;
```

**MySQL** — has no partial indexes, but a unique index allows multiple `NULL`s, so use it over an expression that is the value only for live rows (and `NULL` for tombstones):

```sql
ALTER TABLE `User`
  ADD UNIQUE INDEX `User_email_active_key` (
    (CASE WHEN `deletedAt` IS NULL THEN `email` END)
  );
```

:::caution
Migrations are diff-based, so if you leave `@unique` on the field the next `migrate dev` will detect the plain index as "missing" and try to recreate it. To keep the schema and database in sync, drop `@unique` from the field in ZModel and let the manual partial index enforce uniqueness instead. 
:::
