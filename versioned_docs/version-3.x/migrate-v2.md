---
description: How to migrate from a ZenStack v2 project to v3
sidebar_position: 11
---

import PackageInstall from './_components/PackageInstall';

# Migrating From ZenStack V2

## Overview

ZenStack v3 is a major rewrite of v2, with a focus on simplicity and flexibility. It replaced Prisma ORM with its own ORM component built on top of [Kysely](https://kysely.dev/), resulting in a much more lighter-weight architecture and the level of extensibility that we couldn't achieve in v2.

A few v3 design decisions should make an upgrade much less painful:

- The ZModel schema is compatible with v2.
- The ORM query API is compatible with that of `PrismaClient`, thus compatible with v2.

However, given the architectural changes, some effort is required to adapt to the new system. This guide will help you migrate an existing ZenStack v2 project.

## Compatibility Check

Here are a few essential items to verify before preparing your migration:

- Database support
   
   V3 currently only supports PostgreSQL and SQLite databases. MySQL will be added later.

   For PostgreSQL, only native the traditional TCP-based connection is supported. Newer HTTP-based protocols, such as those supported by providers like Neon and Prisma PG, are not yet supported, but will be in the future.

- Prisma feature gaps

   A few Prisma ORM's features are not implemented or not planned. Please check the [Prisma Feature Gaps](./migrate-prisma.md#feature-gaps) for details.

- V2 feature gaps

   A few ZenStack v2 features are not implemented. Some less popular features are planned to be removed. Please check the [Feature Gaps](#feature-gaps) for details.

## Migrating Prisma

Since ZenStack v3 is no longer based on Prisma ORM, the first step is to replace Prisma dependencies with ZenStack and update the code where `PrismaClient` is created. Please follow the [Prisma Migration Guide](./migrate-prisma.md) for detailed instructions.

## Migrating Access Policies

Since v3's ZModel language is backward compatible with v2, not much work is required in ZModel files. One necessary change is that, if you use access policies (`@@allow`, `@@deny`, etc.), they are now declared in self-contained plugins. You need to install the package separately, add a plugin declaration in ZModel, and then install the plugin at runtime.

1. Install the package

  <PackageInstall dependencies={["@zenstackhq/plugin-policy"]} />

2. Add a plugin declaration in ZModel

  ```zmodel title="schema.zmodel"

  // adding the plugin makes attributes like `@@allow` and `@@deny` work
  plugin policy {
      provider = '@zenstackhq/plugin-policy'
  }

  ```

3. Install the plugin at runtime

```ts title="db.ts"
import { PolicyPlugin } from '@zenstackhq/plugin-policy';

// ORM client without access control
export const db = new ZenStackClient({ ... });

// ORM client with access control
export const authDb = db.$use(new PolicyPlugin());
```

When you need to query the database with a specific user identity, call the `$setAuth()` method on the ORM client (with the access policy plugin installed) to get a user-bound instance.

```ts
async function processRequest(request: Request) {
  // get the validated user identity from your auth system
  const user = await getCurrentUser(request);

  // create a user-bound ORM client
  const userDb = authDb.$setAuth(user);

  // process the request with `userDb`
  ...
}
```

The policy rules in ZModel are mostly backward compatible, except for a breaking change about post-update policies. In v3, post-update rules are expressed with their own "post-update" policy type and separate from regular "update" rules. Inside "post-update" rules, by default, fields refer to the entity's "after-update" state, and you can use the `before()` function to refer to the "before-update" state. See [Post Update Rules](./orm/access-control/post-update.md) for more details.

Here's a quick example for how to migrate:

V2:

```zmodel
model Post {
   ...
   ownerId Int
   owner   User @relation(fields: [ownerId], references: [id])

   // update is not allowed to change the owner
   @@deny('update', future().ownerId != ownerId)
}
```

V3:
```zmodel
model Post {
   ...
   ownerId Int
   owner   User @relation(fields: [ownerId], references: [id])

   // update is not allowed to change the owner
   @@deny('post-update', ownerId != before().ownerId)
}
```

## Migrating Server Adapters

Server adapters are mostly backward compatible. One small change needed is that, when creating a server adapter, it's now mandatory to explicitly pass in an API handler instance (RPC or RESTful). The API handlers are now created with the `schema` object as input. See [Server Adapters](./service/server-adapter.md) for more details.

Here's an example with Express.js:

```ts
import { schema } from '~/zenstack/schema';
import { authDb } from '~/db';

app.use(
  '/api/model',
  ZenStackMiddleware({
    // an API handler needs to be explicitly passed in
    apiHandler: new RPCApiHandler({ schema }),

    // `getPrisma` is renamed to `getClient` in v3
    getClient: (request) => getClientForRequest(request),
  })
);

function getClientForRequest(request: Request) {
  const user = getCurrentUser(request);
  return authDb.$setAuth(user);
}
```

## Migrating Client-Side Hooks

V3 introduces a new implementation of [TanStack Query](https://tanstack.com/query) implementation that doesn't require code generation. Instead, TS types are fully inferred from the schema type at compile time, and the runtime logic is based on the interpretation of the schema object. As a result, the new integration becomes a simple library that you call, and no plugin is involved.

To support such an architecture change. Query hooks are now grouped into an object that mirrors the API style of the ORM client. You need to adjust the v2 code (that uses the flat `useFindMany[Model]` style hooks) into this new structure.

V2:
```ts
import { useFindManyUser } from '~/hooks';

export function MyComponent() {
  const { data } = useFindManyUser({ ... });
  ...
}
```

V3:
```ts
import { useClientQueries } from '@zenstackhq/tanstack-query';
import { schema } from '~/zenstack/schema';

export function MyComponent() {
  const client = useClientQueries(schema);
  const { data } = client.user.useFindMany({ ... });
  ...
}
```

[SWR](https://swr.vercel.app/) support has been dropped due to low popularity.

## Migration Custom Plugins

V3 comes with a completely revised plugin system that offers greater power and flexibility. You can check the concepts in the [Data Model Plugin](./modeling/plugin.md) and [ORM Plugin](./orm/plugins/) documentation.

The plugin development document is still WIP. This part of the migration guide will be added later when it's ready.

## Feature Gaps

This section lists v2 features that haven't been migrated to v3 yet, or that are planned to be removed in v3. Please feel free to share your thoughts about these decisions in [Discord](https://discord.gg/Ykhr738dUe), and we'll be happy to discuss them.

### Automatic password hashing

The `@password` attribute is removed in v3. We believe most people will use a more sophisticated authentication system than a simple id/password mechanism.

### Field-level access control

Not supported yet, but will be added soon with some design changes.

### Data encryption

Not supported yet, but will be added soon.

### Zod integration

Not supported yet, but will be added soon with some design changes.

### Checking permissions without querying the database

The [check()](/docs/guides/check-permission) feature is removed due to low popularity.

### tRPC integration

[TRPC](https://trpc.io/) is TypeScript-inference heavy, and stacking it over ZenStack generates additional complexities and pressure on the compiler. We're evaluating the best way to integrate it in v3, and no concrete plan is in place yet. At least there's no plan to migrate the code-generation-based approach in v2 directly.

### OpenAPI spec generation

The [OpenAPI plugin](/docs/reference/plugins/openapi) has not migrated to v3 yet and will be added later with some redesign.

### SWR integration

The [SWR plugin](https://swr.vercel.app/) is removed due to low popularity.

## FAQ

### Is data migration needed?

No. From the database schema point of view, v3 is fully backward-compatible with v2.
