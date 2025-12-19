---
sidebar_position: 2
---

import PackageInstall from '../../_components/PackageInstall';

# SQLite

## Node.js

### Installing driver

<PackageInstall dependencies={['better-sqlite3']} devDependencies={['@types/better-sqlite3']} />

### Creating ZenStackClient

```ts
import { schema } from './zenstack/schema';
import SQLite from 'better-sqlite3';
import { ZenStackClient } from '@zenstackhq/orm';
import { SqliteDialect } from '@zenstackhq/orm/dialects/sqlite';

const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({ database: new SQLite('./dev.db') }),
});
```

## Bun

### Installing driver

Bun is not compatible with `better-sqlite3`. You can use its builtin `bun:sqlite` module with the `kysely-bun-sqlite` Kysely community dialect.

<PackageInstall dependencies={['kysely-bun-sqlite']} />

### Creating ZenStackClient

```ts
import { schema } from './zenstack/schema';
import { Database } from 'bun:sqlite';
import { ZenStackClient } from '@zenstackhq/orm';
import { BunSqliteDialect } from 'kysely-bun-sqlite';

const db = new ZenStackClient(schema, {
    dialect: new BunSqliteDialect({ database: new Database('./dev.db') }),
});
```