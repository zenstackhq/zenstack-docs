---
sidebar_position: 3
description: Diagnosing ORM performance and behavior issues
---

import AvailableSince from '../../_components/AvailableSince';

# Diagnostics

<AvailableSince version="v3.5.0" />

ZenStack ORM provides built-in diagnostics to help you monitor performance and debug issues. You can configure diagnostics options when creating a `ZenStackClient` and access the results via the `$diagnostics` property.

## Slow Query Tracking

Slow query tracking helps you identify queries that take longer than expected to execute. To enable it, set the `diagnostics.slowQueryThresholdMs` option:

```ts
const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({ ... }),
    diagnostics: {
        // Track queries that take longer than 500ms
        slowQueryThresholdMs: 500,
    },
});
```

Any query whose execution time exceeds the threshold will be recorded in memory. You can then inspect them via `$diagnostics`:

```ts
const diagnostics = await db.$diagnostics;
for (const query of diagnostics.slowQueries) {
    console.log(`[${query.startedAt.toISOString()}] ${query.durationMs}ms: ${query.sql}`);
}
```

Each slow query record contains:
- **`startedAt`** — the `Date` when the query started executing
- **`durationMs`** — how long the query took in milliseconds
- **`sql`** — the SQL statement that was executed

The slow queries are returned sorted by duration in descending order (slowest first).

### Limiting Stored Records

By default, up to **100** slow query records are kept in memory. When the limit is reached, the entry with the lowest duration is replaced if the new query is slower. You can customize this with `slowQueryMaxRecords`:

```ts
const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({ ... }),
    diagnostics: {
        slowQueryThresholdMs: 500,
        // Keep up to 50 slow query records
        slowQueryMaxRecords: 50,
    },
});
```

Set `slowQueryMaxRecords` to `Infinity` to keep unlimited records (use with caution in long-running processes).

## Zod Cache Statistics

The ORM uses [Zod](https://zod.dev) schemas internally for query input validation. These schemas are cached for performance. You can inspect the cache via `$diagnostics`:

```ts
const diagnostics = await db.$diagnostics;
console.log(`Cached Zod schemas: ${diagnostics.zodCache.size}`);
console.log(`Cache keys: ${diagnostics.zodCache.keys.join(', ')}`);
```

The `zodCache` object contains:
- **`size`** — the number of cached Zod schemas
- **`keys`** — the cache keys for the stored schemas

## Shared State Across Derived Clients

Slow query records are shared across derived clients (created via `$use`, `$setOptions`, `$transaction`, etc.). This means all queries are tracked in a single place regardless of which derived client executed them.

```ts
const db = new ZenStackClient(schema, {
    dialect: new SqliteDialect({ ... }),
    diagnostics: { slowQueryThresholdMs: 200 },
});

const derived = db.$use(somePlugin);

// Both clients share the same slow query records
const diagnostics = await derived.$diagnostics;
// includes slow queries from both `db` and `derived`
```
