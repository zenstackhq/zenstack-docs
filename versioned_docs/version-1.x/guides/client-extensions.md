---
description: Using ZenStack with Prisma Client Extensions.
sidebar_position: 11
---

# Using With Prisma Client Extensions

[Prisma Client Extension](https://www.prisma.io/docs/orm/prisma-client/client-extensions) is a mechanism for extending the interface and functionality of Prisma Client. This guide introduces two ways of using ZenStack with client extensions and their implications.

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

## Installing extensions to an enhanced Prisma Client

Such a setup DOES NOT WORK as you would expect in most cases, so it should generally be avoided. For example,

```ts
const enhanced = enhance(prisma);
const db = enhanced.$extends({
  model: {
    post: {
      async getFeeds() {
          const context = Prisma.getExtensionContext(this);
          return context.findMany();
      },
    },
  },
});

const feeds = await db.post.getFeeds();
```

The `getFeeds()` call will return all posts (both published and unpublished ones). This is due to how Prisma internally implements the client extensions. Although you're calling `$extends` on an enhanced client, inside the extension, the context (returned by `Prisma.getExtensionContext(this)`) bypasses ZenStack and directly calls into the original Prisma client.

You can refactor the code to make it work by explicitly referencing the enhanced client in the extension:

```ts
const enhanced = enhance(prisma);
const db = enhanced.$extends({
  model: {
    post: {
      async getFeeds() {
          return enhanced.post.findMany();
      },
    },
  },
});

const feeds = await db.post.getFeeds();
```

It may or may not be practical, depending on the structure of your code base.
