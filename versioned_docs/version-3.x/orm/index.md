---
sidebar_position: 1
description: ZenStack ORM overview
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';

# ORM Overview

ZenStack ORM is a schema-first ORM for modern TypeScript applications. It learnt from the prior arts and strives to provide an awesome developer experience by combining the best ingredients into a cohesive package.

## Key Features

### [Prisma](https://prisma.io/orm)-compatible query API

ZenStack v3 is inspired by Prisma ORM but it has a completely different implementation (based on [Kysely](https://kysely.dev/)). On the surface, it replicated Prisma ORM's query API so that you can use it pretty much as a drop-in replacement. Even if you're not a Prisma user, the query API is very intuitive and easy to learn.

```ts
await db.user.findMany({
    where: {
        email: {
            endsWith: 'zenstack.dev',
        },
    },
    orderBy: {
        createdAt: 'desc',
    },
    include: { posts: true }
});
```

### Low-level query builder powered by [Kysely](https://kysely.dev/)

ORM APIs are concise and pleasant, but they have their limitations. When you need extra power, you can fall back to the low-level query builder API powered by [Kysely](https://kysely.dev/) - limitless expressiveness, full type safety, and zero extra setup.

```ts
await db.$qb
    .selectFrom('User')
    .leftJoin('Post', 'Post.authorId', 'User.id')
    .select(['User.id', 'User.email', 'Post.title'])
    .execute();
```

### Access control

ZenStack ORM comes with a powerful built-in access control system. You can define access rules right inside the schema. The rules are enforced at runtime via query injection, so it doesn't rely on any database specific row-level security features.

```zmodel"
model Post {
    id        Int     @id
    title     String  @length(1, 256)
    published Boolean @default(false)
    author    User    @relation(fields: [authorId], references: [id])
    authorId  Int

    // no anonymous access
    @@deny('all', auth() == null)

    // author has full access
    @@allow('all', authorId == auth().id)

    // published posts are readable by anyone
    @@allow('read', published)
}
```

### Polymorphic models

Real-world applications often involves storing polymorphic data which is notoriously complex to model and query. ZenStack does the heavy-lifting for you so you can model an inheritance hierarchy with simple annotations, and query them with perfect type safety.

```zmodel title="zenstack/schema.zmodel"
model Content {
    id    Int    @id
    name  String @length(1, 256)
    type  String

    // the ORM uses the `type` field to determine to which concrete model
    // a query should be delegated
    @@delegate(type)
}

model Post extends Content {
    content String
}
```

```ts title="main.ts"
const asset = await db.asset.findFirst();
if (asset.type === 'Post') {
    // asset's type is narrowed down to `Post`
    console.log(asset.content);
} else {
    // other asset type
}
```

### Straightforward and light-Weighted

Compared to Prisma and previous versions of ZenStack, v3 is more straightforward and light-weighted.

- No runtime dependency to Prisma, thus no overhead of Rust/WASM query engines.
- No magic generating into `node_modules`. You fully control how the generated code is compiled and bundled.
- Less code generation, more type inference.

## Documentation Conventions

### Sample playground

Throughout the documentation we'll use [StackBlitz](https://stackblitz.com/) to provide interactive code samples. StackBlitz's [WebContainers](https://webcontainers.io/) is an awesome technology that allows you to run a Node.js environment inside the browser. The embedded samples use the [sql.js](https://github.com/sql-js/sql.js) (a WASM implementation of SQLite) for WebContainers compatibility, which is not suitable for production use.

### If you already know Prisma

Although ZenStack ORM has a Prisma-compatible query API, the documentation doesn't assume prior knowledge of using Prisma. However, readers already familiar with Prisma can quickly skim through most of the content and focus on the differences. The documentation uses the following callout to indicate major differences between ZenStack ORM and Prisma:

<ZenStackVsPrisma>
Explanation of some key differences between ZenStack and Prisma ORM.
</ZenStackVsPrisma>
