---
sidebar_position: 10
description: Computed fields in ZModel
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import AvailableSince from '../_components/AvailableSince';

# Computed Fields

<ZenStackVsPrisma>
Prisma client extensions allow you to define computed fields. ZenStack's approach is very different in two aspects:
1. Computed fields are evaluated on the database side, not in the client.
2. Computed fields are defined in the schema and can be used in most places where regular fields are used.
</ZenStackVsPrisma>

Computed fields are "virtual" fields that do not physically exist in the database. They are computed on the fly, but other than that, they behave like regular fields. They are returned as part of the query results, can be used for filtering, sorting, etc., and can be used to define access policies.

## Defining Computed Fields

Defining a computed field involves two steps. First, add the field in the ZModel schema to a model and annotate it with the `@computed` attribute.

```zmodel
model User {
    ...
    postCount Int @computed
}
```

Then, when creating a `ZenStackClient`, provide the implementation of the field using the Kysely query builder.

```ts
const db = new ZenStackClient(schema, {
  ...
  computedFields: {
    User: {
      // equivalent SQL:
      // `(SELECT COUNT(*) AS "count" FROM "Post" WHERE "Post"."authorId" = "User"."id")`
      postCount: (eb) => 
        eb.selectFrom('Post')
          .whereRef('Post.authorId', '=', 'id')
          // the `as('count')` part is required because every Kysely selection 
          // needs to have a name
          .select(({fn}) => fn.countAll<number>().as('count')),
    },
  },
});
```

The computed field callback is also passed with a second `context` argument containing other useful information related to the current query. For example, you can use the `modelAlias` property to refer to the containing model and use it to qualify field names in case of conflicts.

```ts
import { sql } from '@zenstackhq/orm/helpers';

const db = new ZenStackClient(schema, {
  ...
  computedFields: {
    User: {
      postCount: (eb, { modelAlias }) => 
        eb.selectFrom('Post')
          // the `modelAlias` context property gives you a name that you can
          // use to address the containing model (here `User`) at runtime
          .whereRef('Post.authorId', '=', sql.ref(`${modelAlias}.id`))
          .select(({fn}) => fn.countAll<number>().as('count')),
    },
  },
});
```

The full signature of the computed field implementation is as follows:

```ts
import { OperandExpression, ExpressionBuilder } from 'kysely';
import { ClientContract } from '@zenstackhq/orm';

type ComputedFieldCallback = (
  eb: ExpressionBuilder<...>,
  context: {
    modelAlias: string,
    client: ClientContract<Schema>
  }
) => OperandExpression<...>;
```

## Accessing the Client

<AvailableSince version="v3.9.1" />

The `context` argument also carries `client` — the ORM client that's executing the query. Its main use is letting a computed field depend on *who is asking*, since the current user identity lives on the client rather than in the schema.

```zmodel
model User {
    id    Int    @id
    posts Post[]
}

model Post {
    id       Int     @id
    author   User    @relation(fields: [authorId], references: [id])
    authorId Int
    isMine   Boolean @computed
}
```

```ts
import { sql } from '@zenstackhq/orm/helpers';

const db = new ZenStackClient(schema, {
  ...
  computedFields: {
    Post: {
      // `client.$auth` is the identity bound with `$setAuth()`, and `undefined`
      // when the client is anonymous
      isMine: (eb, { client }) =>
        client.$auth
          ? sql<boolean>`${eb.ref('authorId')} = ${client.$auth.id}`
          : eb.lit(false),
    },
  },
});
```

Because `$setAuth()` returns a *new* client rather than mutating the original, each user-bound client evaluates the field against its own identity:

```ts
const userDb = db.$setAuth({ id: 1 });

// only user 1's posts
await userDb.post.findMany({ where: { isMine: true } });

// => { ..., isMine: true }
await userDb.post.findUnique({ where: { id: 1 } });

// the original client is anonymous and unaffected => { ..., isMine: false }
await db.post.findUnique({ where: { id: 1 } });
```

The per-request client that a web app already creates (see [Setting Auth User](./access-control/query.md#setting-auth-user)) therefore carries its identity into every computed field it evaluates, with no module-level state to keep in sync. Reading `$auth` this way doesn't require the access policy plugin — `$setAuth()` and `$auth` are part of the base client.

:::info
A computed field implementation must return its expression **synchronously**, so `client` is meant for reading per-client state such as `$auth`. It is not a way to `await` queries while building a computed field — data-dependent logic belongs in the expression itself, for example as a correlated subquery.
:::

:::tip
The `sql` fragment above is what types a `Boolean @computed` field. A Kysely comparison like `eb('authorId', '=', id)` evaluates correctly, but its type is `SqlBool` (`boolean | 0 | 1`), which doesn't satisfy the `OperandExpression<boolean>` that a `Boolean` field expects. A `sql<boolean>` fragment, `eb.lit()`, or a `CASE` expression built with `eb.case()` all give you the right type.
:::

## Parameterized Computed Fields

<AvailableSince version="v3.9.0" />

A computed field can declare typed **parameters**, with the arguments supplied at query time wherever the field is used. This lets a single field express a database-side computation that depends on a runtime value — for example, "count a user's posts created since a given date", or the motivating case of "sort products by their tag name in a chosen category".

Declare the parameters right after the field name in the ZModel schema (a parameterized field reads just like a regular one, with a parameter list added):

```zmodel
model User {
    id    Int    @id
    posts Post[]
    recentPostCount(since: DateTime) Int @computed
}
```

The implementation receives the arguments as a **third** parameter, after `eb` and `context`:

```ts
import { sql } from '@zenstackhq/orm/helpers';

const db = new ZenStackClient(schema, {
  ...
  computedFields: {
    User: {
      // `args` is typed from the field's declared parameters: `{ since: Date }`
      recentPostCount: (eb, { modelAlias }, args) =>
        eb.selectFrom('Post')
          .whereRef('Post.authorId', '=', sql.ref(`${modelAlias}.id`))
          .where('Post.createdAt', '>=', args.since)
          .select(({ fn }) => fn.countAll<number>().as('count')),
    },
  },
});
```

Because the arguments are **plain data** (not a callback), they serialize over the wire — so a frontend can drive the query through the auto-CRUD API while it stays a single, policy-checked, `select`-narrowed statement.

### Supplying arguments

The `args` object travels with the field wherever it is used. Note that a parameterized field is **not** returned by default (it needs arguments), so a plain `findMany()` won't include it — you request it explicitly via `select`/`include`.

```ts
const since = new Date('2024-01-01');

// orderBy — `{ args, sort, nulls? }`
await db.user.findMany({ orderBy: { recentPostCount: { args: { since }, sort: 'desc' } } });

// where (and `having`) — `args` alongside the filter operators
await db.user.findMany({ where: { recentPostCount: { args: { since }, gte: 5 } } });

// select / include
await db.user.findMany({ include: { recentPostCount: { args: { since } } } });
await db.user.findFirst({ select: { id: true, recentPostCount: { args: { since } } } });

// aggregate — `_count` / `_sum` / `_avg` / `_min` / `_max`
await db.user.aggregate({ _sum: { recentPostCount: { args: { since } } } });

// groupBy — a keyed `{ field, args }` entry in `by`
await db.user.groupBy({
  by: [{ field: 'recentPostCount', args: { since } }],
  _count: { _all: true },
});
```

The full signature of a parameterized computed field implementation adds the `args` parameter:

```ts
import { OperandExpression, ExpressionBuilder } from 'kysely';
import { ClientContract } from '@zenstackhq/orm';

type ParameterizedComputedFieldCallback = (
  eb: ExpressionBuilder<...>,
  context: {
    modelAlias: string,
    client: ClientContract<Schema>
  },
  args: {
    // derived from the field's declared parameters, e.g. `since: DateTime` -> `since: Date`
    since: Date
  }
) => OperandExpression<...>;
```

:::info
Grouping **by** a computed field whose implementation is a *correlated subquery* is subject to your database's own rules for grouping by a correlated expression (PostgreSQL rejects it; SQLite allows it) — the same constraint that applies to any correlated `GROUP BY`. Computed fields defined by a row-local expression can be grouped on all databases.
:::

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-computed-fields" />
