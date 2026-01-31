---
sidebar_position: 1
description: ORM plugin introduction
---

import ZenStackVsPrisma from '../../_components/ZenStackVsPrisma';
import PreviewFeature from '../../_components/PreviewFeature';

# Plugin Overview

<PreviewFeature name="Plugin feature" />

<ZenStackVsPrisma>
ZenStack's plugin system aims to provide a far more flexible extensibility solution than [Prisma Client Extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions), allowing you to tap into the ORM runtime at different levels. Some parts of the plugin design resemble client extensions, but overall, it's not meant to be compatible.
</ZenStackVsPrisma>

ZenStack ORM's extensibility generally falls into two categories: [hooking into CRUD lifecycle](#hooking-into-crud-lifecycle) and [extending ORM client API](#extending-orm-client-api).

## Defining a plugin

ORM plugins are simple objects that implement the [`RuntimePlugin`](../../reference/api#runtimeplugin) interface from the `@zenstackhq/orm` package. You can choose one of the following (equivalent) ways to define a plugin:

1. Creating an object that satisfies the `RuntimePlugin`'s typing.
   ```ts
   db.$use({
     id: 'my-plugin',
     ...
   });
   ```
2. Defining a class that implements the `RuntimePlugin` interface.
   ```ts
   class MyPlugin implements RuntimePlugin<Schema> {
     readonly id = 'my-plugin';
     ...
   }
   db.$use(new MyPlugin());
   ```
3. Using the `definePlugin` helper function for more convenient type inference.
   ```ts
   import { definePlugin } from '@zenstackhq/orm';
   db.$use(definePlugin({
     id: 'my-plugin',
     ...
   }));
   ```

## Hooking into CRUD lifecycle

As you go deeper using an ORM, you'll find the need to tap into its engine for different purposes. For example, you may want to:

- Log the time cost of each query operation.
- Block certain CRUD operations.
- Execute code when an entity is created, updated, or deleted.
- Modify the SQL query before it's sent to the database.
- ...

ZenStack ORM provides three ways for you to tap into its runtime:

1. **Query API hooks**
   
    Query API hooks allow you to intercept ORM query operations (`create`, `findUnique`, etc.). You can execute arbitrary code before or after the query operation, or even block the operation altogether. See [Query API Hooks](./query-api-hooks.md) for details.

2. **Entity mutation hooks**
   
    Entity mutation hooks allow you to execute code before or after an entity is created, updated, or deleted. It's very useful when you only care about entity changes instead of how the mutations are triggered. See [Entity Mutation Hooks](./entity-mutation-hooks.md) for details.

3. **Kysely query hooks**

    Kysely query hooks give you the ultimate power to inspect and transform the SQL query (in AST form) before it's sent to the database. It's a very powerful low-level extensibility that should be used with care. See [Kysely Query Hooks](./kysely-query-hooks.md) for details.

All three types of plugins are installed via the unified `$use` method on the ORM client. The `$use` method returns a new ORM client with the plugin applied, without modifying the original client. You can use the `$unuse` or `$unuseAll` methods to remove plugin(s) from a client.

```ts
const db = new ZenStackClient({ ... });
const withPlugin = db.$use({ ... });
const noPlugin = withPlugin.$unuseAll();
```

## Extending ORM client API

Plugins can also extend the ORM client API by adding new methods/properties to it, or introducing new properties to the query arguments.

For example, when building a cache plugin that cache query results, you may want to let all read query APIs (`findMany`, `groupBy`, etc.) accept an additional `cache` option to configure the caching behavior. And you may want to introduce a top-level `$invalidateCache()` method to clear the cache.

See [Extending ORM Client API](./extending-orm-client.md) page for details.

---

:::info
Plugins can also extend the ZModel language and ZenStack's CLI. Please refer to the [Plugin Development](../../recipe/plugin-dev.md) documentation for a comprehensive guide.
:::
