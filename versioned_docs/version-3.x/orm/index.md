---
sidebar_position: 1
description: ZenStack ORM overview
---

# Overview

ZenStack ORM is a schema-first ORM for modern TypeScript applications. It learnt from the prior arts and aims to provide an awesome developer experience by combining the best ingredients into a cohesive package.

## Key Features

### [Prisma](https://prisma.io/orm)-Compatible Schema Language

The schema language used by ZenStack (called ZModel) is a superset of Prisma schema language. Every valid Prisma schema can be used with ZenStack unchanged. In addition, ZModel added many important extensions to the language to improve the developer experience and enable advanced features.

```zmodel
model User {
    id String @id @default(cuid())
    email String @unique
    posts Post[]
}

model Post {
    id String @id @default(cuid())
    title String @length(1, 256)
    author User @relation(fields: [authorId], references: [id])
    authorId String
}
```

### [Prisma](https://prisma.io/orm)-Compatible Query API

Although ZenStack has a completely different implementation (based on [Kysely](https://kysely.dev/)), it replicated Prisma ORM's query API so that you can use it pretty much as a drop-in replacement. Even if you're not a Prisma user, the query API is very intuitive and easy to learn.

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

### Low-Level Query-Builder Powered by [Kysely](https://kysely.dev/)

ORM APIs are concise and pleasant, but they have their limitations. When you need extra power, you can fall back to the low-level query builder API powered by [Kysely](https://kysely.dev/) - limitless expressiveness, full type safety, and zero extra setup.

```ts
await db.$qb
    .selectFrom('User')
    .leftJoin('Post', 'Post.authorId', 'User.id')
    .select(['User.id', 'User.email', 'Post.title'])
    .execute();
```

### Access Control

ZenStack ORM comes with a powerful built-in access control system. You can define access rules right inside the schema. The rules are enforced at runtime via query injection, so it doesn't rely on any database specific row-level security features.

```zmodel
model Post {
    id        String @id @default(cuid())
    title.    String @length(1, 256)
    published Boolean @default(false)
    author    User @relation(fields: [authorId], references: [id])
    authorId  String

    // no anonymous access
    @@deny('all', auth() == null)

    // author has full access
    @@allow('all', authorId == auth().id)

    // published posts are readable by anyone
    @@allow('read', published)
}
```

### Polymorphic Models

Real-world applications often involves storing polymorphic data which is notoriously complex to model and query. ZenStack does the heavy-lifting for you so you can model an inheritance hierarchy with simple annotations, and query them with perfect type safety.

```zmodel
model Asset {
    id    String @id @default(cuid())
    title String @length(1, 256)
    type  String

    // the ORM uses the `type` field to determine to which concrete model
    // a query should be delegated
    @@delegate(type)
}

model Post extends Asset {
    content String
}
```

```ts
const asset = await db.asset.findFirst();
if (asset.type === 'Post') {
    // asset's type is narrowed down to `Post`
    console.log(asset.content);
} else {
    // other asset type
}
```

### Straightforward and Light-Weighted

Compared to Prisma and previous versions of ZenStack, v3 is more straightforward and light-weighted.

- No runtime dependency to Prisma, thus no overhead of Rust/WASM query engines.
- No magic generating into `node_modules`. You fully control how the generated code is compiled and bundled.
- Less code generation, more type inference.
