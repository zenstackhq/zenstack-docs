---
sidebar_position: 5
---

import PackageInstall from '../../_components/PackageInstall';

# Prisma Postgres

[Prisma Postgres](https://www.prisma.io/postgres) is a managed PostgreSQL service. It speaks the standard PostgreSQL wire protocol, so it can be used with the regular `pg` driver in the same way as described in the [PostgreSQL](./postgres) guide. This guide explains how to get a connection string and which one to use for queries and migrations.

## Getting a connection string

You can create a temporary database from the command line. The command prints a connection string and a link to claim the database. Unclaimed databases are deleted after 24 hours.

```bash
npx create-db@latest
```

Alternatively, create a database in the [Prisma Console](https://console.prisma.io) and copy its connection string from there. Then set it as the `DATABASE_URL` environment variable.

```bash
DATABASE_URL="postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"
```

## Installing driver

<PackageInstall dependencies={['pg']} devDependencies={['@types/pg']} />

## Creating ZenStackClient

```ts
import { schema } from './zenstack/schema';
import { Pool } from 'pg';
import { ZenStackClient } from '@zenstackhq/orm';
import { PostgresDialect } from '@zenstackhq/orm/dialects/postgres';

const db = new ZenStackClient(schema, {
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
```

## Notes about connection pooling

The `db.prisma.io` host gives you a direct connection to the database. Prisma Postgres also has a built-in connection pooler running in transaction mode, which you can use by changing the host to `pooled.db.prisma.io` and keeping the rest of the connection string the same. `ZenStackClient` queries and transactions work with both hosts.

Use the direct connection string when running `zen migrate` and `zen db push` commands. The migration engine takes a session-level advisory lock that may not be released when going through the pooler, which causes later migration runs to time out waiting for the lock.

## Notes about the serverless driver

Prisma Postgres provides a serverless driver, [@prisma/ppg](https://www.npmjs.com/package/@prisma/ppg), that uses HTTP/WebSocket protocol. It doesn't expose a `pg`-compatible `Pool`, so it can't be passed to `PostgresDialect`. Use the `pg` driver as shown above.
