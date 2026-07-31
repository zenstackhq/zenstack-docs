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
