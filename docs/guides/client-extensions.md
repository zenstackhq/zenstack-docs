---
description: Using ZenStack with Prisma Client Extensions.
sidebar_position: 11
---

# Using With Prisma Client Extensions

[Prisma Client Extension](https://www.prisma.io/docs/orm/prisma-client/client-extensions) is a mechanism for extending the interface and functionality of Prisma Client.

We'll use the following ZModel as a reference throughout this guide:

```zmodel
model Post {
  id Int @id @default(autoincrement())
  title String
  content String?
  published Boolean @default(false)

  @@allow('read', published)
}
```

## Enhancing a Prisma Client with extensions installed

This should be the most common way of using ZenStack with client extensions. You install client extensions to the global `PrismaClient` instance when the application starts and then call `enhance` with the extended client on a per-request basis. It will generally work as you would intuitively expect.

Let's look at a few examples.

### 1. Model-level methods

```ts
const extendedPrisma = prisma.$extends({
  model: {
    post: {
      async getFeeds() {
          const context = Prisma.getExtensionContext(this);
          return context.findMany();
      },
    },
  },
});

const db = enhance(extendedPrisma);
const feeds = await db.post.getFeeds();
```

The `getFeeds()` call will return only published posts. The `context` variable fetched with `Prisma.getExtensionContext(this)` is enhanced by ZenStack.

### 2. Query-level overrides

```ts
const extendedPrisma = prisma.$extends({
  query: {
    post: {
      findMany({ query, args }) {
        console.log('Query args:', inspect(args, { depth: null }));
        return query(args);
      },
    },
  },
});

const enhanced = enhance(extendedPrisma);
const posts = await enhanced.post.findMany();
```

The `findMany` call returns only published posts. The printed log will demonstrate that the `args` is injected by ZenStack to include access policy filters.

You can also override mutation methods and it generally works. However, it must be noted that ZenStack enforces mutation policies before or after the mutation is executed (in the case of "after", a transaction is used to roll back if the policy fails), depending on the access policies and the mutation input. This means that if you alter the mutation args in a client extension to make it conform to the access policy, it may not work because ZenStack intercepts the mutation call first, and may decide to reject it based on the original args.

### 3. Computed fields

```ts
const extendedPrisma = prisma.$extends({
  result: {
    post: {
      myTitle: {
        needs: { title: true },
        compute(post) {
          return 'MyTitle: ' + post.title;
        },
      },
    },
  },
});

const enhanced = enhance(extendedPrisma);
const post = await enhanced.post.findFirst();
```

Computed fields will work as expected. ZenStack enhancement works transparently with it.

:::danger

Currently there's a limitation that computed fields are not governed by field-level access policies. This means that if you have a computed field that depends on a field that the current user cannot read, the computed field will still be calculated and returned.

:::

## Installing extensions to an enhanced Prisma Client

Since v2.9.0, installing client extensions to an enhanced Prisma Client should generate the same result as doing it the opposite way - i.e., call `enhance` on an extended Prisma Client, as explained in the previous section.

```ts
const db = enhance(prisma);
const extended = db.$extends({
  model: {
    post: {
      async getFeeds() {
          const context = Prisma.getExtensionContext(this);
          return context.findMany();
      },
    },
  },
});

const feeds = await extended.post.getFeeds();
// `feeds` will only contain published posts
```
