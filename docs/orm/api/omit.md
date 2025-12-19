---
sidebar_position: 10
description: Omitting Fields
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Omitting Fields

The previous sections have shown how you can use `select` and `omit` clauses to control the fields returned in the query results. There may be scenarios where you want to exclude certain fields (e.g., `password`) for most queries. ZenStack provides a mechanism to configure field omission in a hierarchical manner.

:::info
Please note that the omit settings only affect the ORM query APIs, but not the [Query Builder APIs](../query-builder). With query builder you'll need to explicitly specify the fields to select.
:::

## Schema-Level Omit

You can use the `@omit` attribute in ZModel to mark fields to be omitted. Such fields will be omitted by default for all `ZenStackClient` instances and all queries.

```zmodel
model User {
  id       Int    @id
  name     String
  email    String @unique
  password String @omit
}
```

## Client-Level Omit

When creating a `ZenStackClient`, you can customize what fields to omit by specifying the `omit` option.

```ts
const db = new ZenStackClient<Schema>({
  ...
  omit: {
    User: { email: true }
  },
});
```

You can also use the `$setOptions` API to create a shallow clone of an existing client with different options:

```ts
const db = new ZenStackClient<Schema>({ ... });
const dbNoEmail = db.$setOptions({
  ...db.$options,
  omit: {
    User: { email: true }
  },
});
```

## Query-Level Omit

Finally, at query time you can use the `omit` clause for per-query control.

```ts
const users = await db.user.findMany({
  omit: { name: true },
});
```

## Precedence and Overrides

The precedence of omit settings is: query-level > client-level > schema-level. A higher precedence setting can override a lower one and re-include a field by negating the omit flag. E.g., at query time you can re-include the `password` field that was omitted at schema level:

```ts
const users = await db.user.findMany({
  omit: { password: false },
});
```

There might be scenarios where you don't want the query-level override feature. For example, when using `ZenStackClient` with the [Query as a Service](../../service), you may want to have certain fields always omitted for security reasons. In such cases, use the `allowQueryTimeOmitOverride` option to disable query-time overrides:

```ts
const db = new ZenStackClient<Schema>({
  ...
  allowQueryTimeOmitOverride: false,
});
```

When this option set to `false`, any attempt to negate an omission at query time will trigger a validation error.

```ts
// This will throw an error because query-time override is disabled.
const users = await db.user.findMany({
  omit: { password: false },
});
```

