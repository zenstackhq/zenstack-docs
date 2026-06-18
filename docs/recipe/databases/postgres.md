---
sidebar_position: 1
---

import PackageInstall from '../../_components/PackageInstall';

# PostgreSQL

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

## Using PGlite

:::danger No Official Support
The PGlite dialect is not officially supported or tested by ZenStack, but you may evaluate it and [report your findings and interest on the GitHub issue](https://github.com/zenstackhq/zenstack/issues/2710).
:::

<PackageInstall dependencies={['@electric-sql/pglite', 'kysely']} />

```ts
import { schema } from './zenstack/schema';
import { PGlite } from '@electric-sql/pglite';
import { ZenStackClient } from '@zenstackhq/orm';
import { PGliteDialect } from 'kysely';

const db = new ZenStackClient(schema, {
    dialect: new PGliteDialect({
        pglite: new PGlite(),
    }),
});
```
