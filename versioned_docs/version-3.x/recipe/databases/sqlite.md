---
sidebar_position: 2
---

import PackageInstall from '../../_components/PackageInstall';

# SQLite

## Installing driver

<PackageInstall dependencies={['better-sqlite3']} devDependencies={['@types/better-sqlite3']} />

## Creating ZenStackClient

```ts
import { schema } from './zenstack/schema';
import SQLite from 'better-sqlite3';
import { ZenStackClient } from '@zenstackhq/orm';
import { SqliteDialect } from '@zenstackhq/orm/dialects/sqlite';

const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({ database: new SQLite('./dev.db') }),
});
```
