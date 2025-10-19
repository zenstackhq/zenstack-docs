---
description: Creating a database client
---

import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import PackageInstall from '../_components/PackageInstall';
import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';

# Database Client

<ZenStackVsPrisma>
Unlike Prisma, ZenStack doesn't bundle any database driver. You're responsible for installing a compatible one. Also it doesn't read database connection string from the schema. Instead, you pass in the connection information when creating the client.
</ZenStackVsPrisma>

The `zen generate` command compiles the ZModel schema into TypeScript code, which we can in turn use to initialize a type-safe database client. ZenStack uses Kysely to handle the low-level database operations, so the client is initialize with a [Kysely dialect](https://kysely.dev/docs/dialects) - an object that encapsulates database details.

The samples below only show creating a client using SQLite (via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)) and PostgreSQL (via [node-postgres](https://github.com/brianc/node-postgres)), however you can also use any other Kysely dialects for these two types of databases.

<Tabs>

<TabItem value="sqlite" label={`SQLite`}>

<PackageInstall dependencies={["better-sqlite3"]} devDependencies={['@types/better-sqlite3']} />

```ts title='db.ts'
import { ZenStackClient } from '@zenstackhq/runtime';
import { SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { schema } from './zenstack/schema';

export const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({
        database: new SQLite(':memory:'),
    }),
});
```
</TabItem>

<TabItem value="postgres" label={`PostgreSQL`}>

<PackageInstall dependencies={["pg"]} devDependencies={['@types/pg']} />

```ts title='db.ts'
import { ZenStackClient } from '@zenstackhq/runtime';
import { schema } from './zenstack/schema';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const db = new ZenStackClient(schema, {
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
```
</TabItem>

</Tabs>

The created `db` object has the full ORM API inferred from the type of the `schema` parameter. When necessary, you can also explicitly get the inferred client type like:

```ts
import type { ClientContract } from '@zenstackhq/runtime';
import type { SchemaType } from '@/zenstack/schema';

export type DbClient = ClientContract<SchemaType>;
```
