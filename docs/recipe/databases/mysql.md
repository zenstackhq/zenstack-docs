---
sidebar_position: 4
---

import PackageInstall from '../../_components/PackageInstall';

# MySQL


## Installing driver

<PackageInstall dependencies={['mysql2']} />

## Creating ZenStackClient

```ts
import { schema } from './zenstack/schema';
import { createPool } from 'mysql2';
import { ZenStackClient } from '@zenstackhq/orm';
import { MysqlDialect } from '@zenstackhq/orm/dialects/mysql';

const db = new ZenStackClient(schema, {
  dialect: new MysqlDialect({
    pool: createPool(process.env.DATABASE_URL),
  }),
});
```
