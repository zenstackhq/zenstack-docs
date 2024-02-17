---
description: How to upgrade to ZenStack v2

slug: /upgrade-v2
sidebar_label: Upgrading to V2
sidebar_position: 8
---

# Upgrading to V2

## What's New

### Polymorphic Relations

Polymorphic relations allows you to model relations over an "abstract interface". This feature is inspired by the following Prisma issues:

- [Support for a Union type](https://github.com/prisma/prisma/issues/2505)
- [Support for Polymorphic Associations](https://github.com/prisma/prisma/issues/1644)

See the [Polymorphic Relations](./guides/polymorphism) recipe for more information.

### Using `auth()` in `@default()`

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

### Permission Checker API 🚧

Coming soon.

### Edge Runtime Support 🚧

Coming soon.

## Upgrading

V2 features will be continuously released using the "@next" npm tag. To upgrade, update your project's dependencies of `zenstack` and `@zenstackhq/*` packages to the `@next` tag.

```bash
npm i -D zenstack@next
npm i @zenstackhq/runtime@next
...
```

## Breaking Changes

The following sections list breaking changes introduced in ZenStack V2 and guide for upgrading your project.

### 1. Unified `enhance` API

In V1, there were several `withXXX` APIs (like `withPolicy`, `withOmit`, etc.) that help you create enhanced PrismaClient instances with specific enhancements. These APIs are now deprecated and unified to the single `enhance` API. You can use the `kinds` option to control what enhancements to apply:

```ts
const db = enhance(prisma, { user }, { kinds: ['policy', 'omit'] })
```

By default, all enhancements are enabled.

### 2. Changes to the `enhance` API

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

### 3. Prisma version below 5.0.0 is not supported anymore

Supporting both Prisma V4 and V5 caused quite some complexities. We decided to require Prisma 5.0.0 and above for ZenStack V2. This also makes it possible to make ZenStack's runtime compatible with Edge environments (TBD).

### 4. Removed support of CLI config file

The "--config" switch and the "zenstack.config.json" file are removed. They weren't doing anything useful and were only kept in V1 for backward compatibility reasons.

We may introduce a new config file format in the future.
