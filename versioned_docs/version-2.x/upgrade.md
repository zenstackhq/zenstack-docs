---
description: How to upgrade to ZenStack v2

slug: /upgrade-v2
sidebar_label: Upgrading to V2
sidebar_position: 9
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

# Upgrading to V2

We're excited to announce the release of ZenStack V2 🎉!

While V1 focused on implementing an access control layer around Prisma, V2 is more ambitious and desires to solve some deeper problems in modeling a database-centric application while continuing to improve the overall developer experience.

This document outlines the first batch of new features, together with breaking changes and upgrade instructions. More goodies will land in the future V2 series releases. Enjoy, and please [share your feedback](https://discord.gg/Ykhr738dUe)!

## What's New

### 1. Polymorphic Relations

Polymorphic relations allows you to model relations over an "abstract interface". This feature is inspired by the following Prisma issues:

- [Support for a Union type](https://github.com/prisma/prisma/issues/2505)
- [Support for Polymorphic Associations](https://github.com/prisma/prisma/issues/1644)

See the [Polymorphic Relations](./guides/polymorphism) recipe for more information.

### 2. Using `auth()` in `@default()`

You can now use the `auth()` function inside the `@default()` attribute. A very common use case is to automatically assign foreign key field when creating entities with relation with the current user. In ZenStack V1, you needed to explicitly assign foreign key value even though the enhanced `PrismaClient` already implies a current user:

```zmodel title="schema.zmodel"
model User {
  id Int @default(autoincrement())
}

model Post {
  id Int @default(autoincrement())
  title String
  owner User @relation(fields: [ownerId], references: [id])
  ownerId Int
}
```

```ts
const db = enhance(prisma, { user });
await db.post.create({
  data: {
   owner: { connect: { id: user.id } },
   title: 'Post1'
  }
})
```

With this feature, you can update the schema to:

```zmodel title="schema.zmodel"
model User {
  id Int @default(autoincrement())
}

model Post {
  id Int @default(autoincrement())
  title String
  owner User @relation(fields: [ownerId], references: [id])
  ownerId Int @default(auth().id) // <- assign ownerId automatically
}
```

and when creating a `Post`, you don't need to explicitly connect `owner` anymore.

```ts
const db = enhance(prisma, { user });
await db.post.create({ data: { title: 'Post1' } });
```

### 3. Fine-grained Optimistic Updates

Previously the ZenStack-generated data query hooks (TanStack Query and SWR) support automatic optimistic updates. When a mutation executes, the hooks analyzes what queries are potentially affected and try to compute an optimistically updated piece of data, and use it to update the query cache. This feature is very useful in many cases, but it can't cover all cases. For example, if you create an entity and connect it to a related entity at the same time, the automatic optimistic logic doesn't know how to compute the relation (if it's used in a related query).

In V2, we introduce a `optimisticUpdateProvider` callback for the caller to decide how to compute the optimistic data for a mutation, for every query cache entry. Here's how to use it:

```ts
useCreatePost({
  optimisticUpdateProvider: ({ queryModel, queryOperation, queryArgs, currentData, mutationArgs }) => {
    return { kind: 'Update', data: ... /* computed result */ };
  }
});
```

See more information [here]:

The callback is invoked for each query cache entry. You can use the return value to control if to use the optimistic data you computed, skip the update, or leave it to the automatic logic.

### 4. Prisma-Like Schema Formatting

We've heard your feedback: the way how Prisma formats the schema code makes it more readable. Now ZenStack's IDE extensions and the CLI `format` command resemble Prisma's behavior and format fields into a tabular form.

<ThemedImage
    alt="ZModel Formatting"
    sources={{
        light: useBaseUrl('/img/zmodel-format-light.png'),
        dark: useBaseUrl('/img/zmodel-format-dark.png'),
    }}
/>

You can switch back to the old behavior in the extension settings (VSCode only).

### 5. Edge Runtime Support

We've updated the `@zenstackhq/runtime` package to be compatible with Vercel Edge Runtime and Cloudflare Workers. See [this documentation](./guides/edge) for more details.

### 6. Permission Checker API (Preview)

ZenStack's access policies prevent unauthorized users to query or mutate data. However, there are cases where you simply want to check if an operation is permitted without actually executing it. For example, you might want to show or hide a button based on the user's permission.

The new permission checker API allows to check a user's permission without querying the database.

```ts
const db = enhance(prisma, { user: getCurrentUser() });

// check if the current user can read published posts
await canRead = await db.post.check({
  operation: 'read',
  where: { published: true }
});
```

Please check [this guide](./guides/check-permission) for more details.

## Upgrading

### NPM Packages

To upgrade, update your project's dependencies of `zenstack` and `@zenstackhq/*` packages to the `@latest` tag.

```bash
npm i -D zenstack@latest
npm i @zenstackhq/runtime@latest
...
```

### IDE Extensions

Please upgrade VSCode extension and JetBrains plugin to the latest version.

## Breaking Changes

The following sections list breaking changes introduced in ZenStack V2 and guide for upgrading your project.

### 1. ZModel Schema

- #### No more access to declarations from indirectly imported schemas

  V1 had an unintended behavior that you can access a declaration without importing the ZModel file where it's declared, as long as the schema is indirectly imported.

  The behavior is changed in V2. If you use a declaration from another ZModel, you'll need to explicitly import it.

  Please note that this implies if you use `auth()` function in access policies, you'll need to import the ZModel where the `User` model (or the model marked with `@@auth`) so that `auth()` can be resolved. If you feel it causes extra imports in too many schema files, please leave your feedback in [this GitHub issue](https://github.com/zenstackhq/zenstack/issues/1388).

### 2. Runtime

- #### Unified `enhance` API

  In V1, there were several `withXXX` APIs (like `withPolicy`, `withOmit`, etc.) that help you create enhanced PrismaClient instances with specific enhancements. These APIs are now deprecated and unified to the single `enhance` API. You can use the `kinds` option to control what enhancements to apply:

  ```ts
  const db = enhance(prisma, { user }, { kinds: ['policy', 'omit'] })
  ```

  By default, all enhancements are enabled.

- #### Changes to the `enhance` API

  One of the main changes in V2 is that the `enhance` API is now generated, by default into the `node_modules/.zenstack` package, together with other supporting modules. The `@zenstackhq/runtime/enhance` module is simply a reexport of `.zenstack/enhance`. This change allows us to customize the API of the enhanced `PrismaClient` based on the enhancements enabled.

  The change also simplifies the way how the `enhance` API is used when you specify a custom output location (usually for checking in the generated files with the source tree). For example, if you use the "--output" CLI switch to output to "./.zenstack" folder:

  ```bash
  npx zenstack generate --output ./.zenstack
  ```

  You can import the `enhance` API directly from the output location and use it without any other changes:

  ```ts
  import { enhance } from './.zenstack/enhance';

  const db = enhance(...);
  ```

  Several options of the `enhance` API are also removed because they are no more needed:

  - policy
  - modelMeta
  - zodSchemas
  - loadPath
    
  These options were for guiding ZenStack to load the generated modules from a custom location. They are not needed anymore because the generated `enhance` API can always load them from relative paths.

  Another major benefit of generating `enhance` is the `user` context object is now strongly typed. The CLI statically analyzes the ZModel schema to identify the fields accessed through `auth()` (including multi-level accesses into relation fields), and use that information to type the `user` object. This helps you to identify missing or incorrectly typed fields and avoid unexpected runtime behavior.

- #### Strict typing for the user context

  The `enhance` API now analyzes the fields accessed through `auth()` in ZModel access policies and use that to derive a strong typed `user` context. For example, if your ZModel looks like:

  ```zmodel
  model Post {
    id Int @id
    ...
    @@allow('all', auth().role == ADMIN)
  }
  ```

  You'll get an compile-time error if you pass an `user` object without the `role` field:

  ```ts
  const db = enhance(prisma, { user: { id: userId }}); // <- `role` field is required
  ```

- #### Prisma version below 5.0.0 is not supported anymore

  Supporting both Prisma V4 and V5 caused quite some complexities. We decided to require Prisma 5.0.0 and above for ZenStack V2. This also makes it possible to make ZenStack's runtime compatible with Edge environments (TBD).

### 3. CLI

- #### Removed support of CLI config file

  The "--config" switch and the "zenstack.config.json" file are removed. They weren't doing anything useful and were only kept in V1 for backward compatibility reasons.

  We may introduce a new config file format in the future.

### 4. Server Adapter

- #### HTTP status code `422` is used to represent data validation errors

  In V1, when a [data validation](./reference/zmodel-language.md#data-validation) error happens (due to violation of rules represented by `@email`, `@length`, `@@validate` etc.), the server adapters used `403` to represent such error. This is changed in V2 to use `422` to align with the [HTTP status code definition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422).

- #### The deprecated `useSuperJSON` initialization options is removed

  The server adapters always use SuperJSON for serialization and deserialization.

### 5. Plugins

:::warning
All plugins now automatically clean up the output directory before generating new files. Please make sure not to mix manually created files with the generated ones to to avoid data loss.
:::

#### 5.1 Zod Plugin

- ##### Changes to the optionality of `[Model]Schema` schema

  In V1, the generated `[Model]Schema` schema has all fields marked optional. This is changed in V2 to respect the optionality of fields as they are declared in ZModel.

#### 5.2. SWR Plugin

- ##### Legacy mutation functions are removed

  In V1, the SWR plugin used to generate a set of legacy mutation functions via the `useMutate[Model]` hook. These functions (together with the hook) are removed in V2. You should use the individual mutation hooks instead.

  Old code:

  ```ts
  import { useMutatePost } from '@lib/hooks';

  const { createPost } = useMutatePost();
  await createPost({ data: {...} });
  ```

  New code:

  ```ts
  import { useCreatePost } from '@lib/hooks';

  const { trigger: createPost, isMutating } = useCreatePost();
  await createPost({ data: {...} })
  ```

- ##### The `initialData` query option is removed

  Use the `fallbackData` option instead.

#### 5.3. TanStack Query Plugin

- ##### Default target version is now "v5".

  In V1 the default target version was TanStack Query V4.

- ##### Generated hooks got simplified parameters

  The query and mutation hooks generated in V1 had a few parameters like `invalidateQueries` and `optimisticUpdate`. These parameters are merged into the `options` parameter. The `options` parameter is used for configuring both tanstack-query and the additional behavior of ZenStack.

  Old code:

  ```ts
  useFindManyPost(
    { where: { ... } }, /* query args */
    undefined, /* tanstack-query options */
    false /* opt-out optimistic update*/
  );

  useCreatePost(
    undefined /* tanstack-query options */,
    false, /* whether to automatically invalidate related queries */
    true /* whether to optimistically update related queries */
  )
  ```

  New code:

  ```ts
  useFindManyPost({ where: { ... } }, { optimisticUpdate: false });

  useCreatePost({ invalidateQueries: false, optimisticUpdate: true });
  ```
