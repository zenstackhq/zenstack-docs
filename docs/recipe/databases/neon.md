---
sidebar_position: 3
---

import PackageInstall from '../../_components/PackageInstall';

# Neon

Neon can be used with the regular `pg` driver as described in the [PostgreSQL](./postgres) guide. It also provides a serverless driver that uses HTTP/WebSocket protocol which works in edge environments. This guide explains how to use the serverless driver with ZenStack.

## Installing driver

<PackageInstall dependencies={['@neondatabase/serverless']} />

## Creating ZenStackClient

```ts
import { schema } from '@/zenstack/schema';
import { Pool } from '@neondatabase/serverless';
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

## Notes about edge runtime

Edge environments are ephemeral and often only live to serve a single request. Instead of holding a global singleton client instance, you should create a new one per request. The serverless driver is designed to be used this way.

```ts
export async function handler(req: Request): Promise<Response> {
    const db = createClient();
    // use db...
    await db.$disconnect();
    return new Response('ok');
}
```
