---
sidebar_position: 13
description: Setup logging
---

# Logging

Logging can be enabled by passing a `log` option when creating a `ZenStackClient` instance. The log option can be a list of log levels, causing the client to log messages at those levels to the console:

```ts
const db = new ZenStackClient(..., {
  log: ['query', 'error'],
});
```

Or it can be a logging function that receives a log object with the following type:

```ts
// https://kysely.dev/docs/recipes/logging

interface LogEvent {
  // log level
  level: 'query' | 'error';

  // the query compiled by Kysely, including the SQL AST, raw SQL string, and parameters.
  query: CompiledQuery;
  
  // time taken to execute the query
  queryDurationMillis: number; 

  // error information, only present if `level` is `'error'`
  error: unknown;
}
```

```ts
const db = new ZenStackClient(..., {
  log: (event) => {
    console.log(`[${event.level}] ${event.queryDurationMillis}ms`);
  },
});
```

The `log` option is passed through to the underlying Kysely instance.
