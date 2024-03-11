---
description: Polymorphic Relations
sidebar_position: 10
---

# Polymorphic Relations

## Introduction

Modeling relations in Prisma is straightforward: you define fields referencing the model of the other side of the relation, and associate them with the `@relation` attribute, e.g.:

```zmodel
model User {
  id Int @id @default(autoincrement())
  posts Post[]
}

model Post {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title String
  owner User @relation(fields: [ownerId], references: [id])
  ownerId Int
}
```

However, if the `User` model has relations with many models, it'll need to declare relation field (like the `posts` field above) for each of them. It's a very common pattern in applications where a model type is polymorphically related to many other types of models. For example, a user can own posts, videos, comments, etc. In such cases, the schema will look like this:

```zmodel
model User {
  ...
  posts Post[]
  videos Video[]
  ...
}

model Post {
  ...
  title String
}

model Video {
  ...
  duration Int
}
```

The way how it's modeled in Prisma is awkward for several reasons:

1. The `User` model needs to be updated every time a new polymorphic model is added.
2. There's no way to query the polymorphic models uniformly with sorting and pagination.
3. You can't easily model access policies consistently across the polymorphic models.

There are several Prisma issues related to this missing feature:

- [Support for a Union type](https://github.com/prisma/prisma/issues/2505)
- [Support for Polymorphic Associations](https://github.com/prisma/prisma/issues/1644)

## ZenStack Implementation

One of the main things ZenStack does is to "enhance" `PrismaClient`. So it's natural to support polymorphism as an enhancement. There are several strategies to implement polymorphism in the database as summarized in [this blog post](/blog/polymorphism). ZenStack chooses to take the "delegated types" design, which has a good balance between flexibility and efficiency.

### Usage

#### Modeling

To define a polymorphic hierarchy, you first define a base model, and them inherit from it. The base model should be marked with the `@@delegate` attribute. The attribute requires a parameter referencing a discriminator field - used for storing the concrete model type it delegates. Here's an example:

```zmodel
model User {
  id Int @id @default(autoincrement())
  contents Content[]
}

model Content {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean @default(false)
  owner User @relation(fields: [ownerId], references: [id])
  ownerId Int
  contentType String

  @@delegate(contentType)
}

model Post extends Content {
  title String
}

model Video extends Content {
  name String
  duration Int
}
```

:::info Difference from abstract inheritance
ZenStack v1 already supports [inheriting from abstract models](./multiple-schema#abstract-model-inheritance). Abstract inheritance merely copies over the fields and attributes from the base model to the child. It doesn't really provide a polymorphic hierarchy.
:::

#### Querying

To use polymorphic relations, you should create an enhanced `PrismaClient` with the "delegate" enhancement kind enabled - either by a simple `enhance` call with all kinds enabled:

```ts
const db = enhance(prisma, { user });
```

, or by explicitly specifying the "delegate" kind:

```ts
const db = enhance(prisma, { user }, { kinds: ['delegate'] });
```

You can then work with the inheritance hierarchy pretty much like how you deal with polymorphism in OOP:

```ts
// create a user
const user = await db.user.create({ data: { id: 1 } });

// create a concrete `Post` model
const post = await db.post.create({
  data: {
    owner: { connect: { id: user.id } }, 
    title: 'Post1' 
  },
});

// create a concrete `Video` model
const video = await db.video.create({
  data: {
    owner: { connect: { id: user.id } },
    name: 'Video1',
    duration: 100,
  }
});

// query with concrete model, will return fields from both base and concrete models
// [ 
//   { id: 1, ownerId: 1, contentType: 'Post', title: 'Post1', published: false, createdAt: ..., updatedAt: ... },
//   { id: 2, ownerId: 1, contentType: 'Video', name: 'Video1', duration: 100, published: false, createdAt: ..., updatedAt: ... }
// ]
console.log('All posts:', inspect(await db.post.findMany()));

// query with base model, will also return fields from both base and concrete models, but with base's typing
// [ 
//   { id: 1, ownerId: 1, contentType: 'Post', title: 'Post1', published: false, createdAt: ..., updatedAt: ... },
//   { id: 2, ownerId: 1, contentType: 'Video', name: 'Video1', duration: 100, published: false, createdAt: ..., updatedAt: ... }
// ]
console.log('All contents:', inspect(await db.content.findMany()));

// you can use the discriminator field to help TypeScript narrow down the typing
const firstContent = await db.content.findFirstOrThrow();
if (firstContent.contentType === 'Post') {
  console.log('Post title:', firstContent.title);
} else {
  console.log('Video name:', firstContent.name);
}

// set all contents as published from the user
await db.user.update({
  where: { id: user.id },
  data: {
    contents: { 
      updateMany: { where: {}, data: { published: true } } 
    },
  },
});

// delete with base model
await db.content.deleteMany();

// querying with concrete model again will get an empty array 
// because of the cascaded deletion
console.log('All posts after delete:', inspect(await db.post.findMany()));
```

:::danger

You should never manipulate the concrete models with a raw `PrismaClient` or one without the "delegate" enhancement kind enabled. This may cause corruption to the relation between the base and concrete entities.

:::

### Access Policies

In an delegated inheritance hierarchy, all access policies from the base models are inherited to the sub models. This ensures that when you directly manipulate base model's fields with a sub model, the access policies on the base are effective.

Here's how you can add policies to the sample schema:

```zmodel
model User {
  id Int @id @default(autoincrement())
  contents Content[]

  @@allow('create,read', true)
  @@allow('all', auth() == this)
}

model Content {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId Int
  published Boolean @default(false)
  contentType String

  @@delegate(contentType)

  @@allow('read', published)
  @@allow('all', auth() == owner)
}

model Post extends Content {
  title String
}

model Video extends Content {
  name String
  duration Int
}
```

### Sample Project

- Simple TypeScript script sample: [https://github.com/zenstackhq/v2-polymorphism](https://github.com/zenstackhq/v2-polymorphism)
- Full-stack blog app sample (use `polymorphic` branch): [https://github.com/zenstackhq/docs-tutorial-nextjs/tree/polymorphic](https://github.com/zenstackhq/docs-tutorial-nextjs/tree/polymorphic)

### Inner Workings

ZenStack works with two versions of `PrismaClient` to achieve polymorphism:

- **Logical view**
  
  It's the `PrismaClient` an end-developer sees when using the enhanced client. The logical client copies all fields of the base models to the sub models to give you the experience of inheritance. The logical client is only for providing polymorphic typing, and it's not mapped to the database schema or used for real database operations.

  The logical `PrismaClient` is derived from a Prisma schema generated into "node_modules/.zenstack/delegate.schema".
  
- **Physical view**
  
  It's the `PrismaClient` ZenStack internally uses when working with the database. It's derived from the Prisma schema that's normally generated as the output of `zenstack generate`. The physical client also aligns with your database schema: fields of base and sub models only reside in their respective tables without duplication, and they are linked with foreign keys.

The main thing that ZenStack does internally is to translate between these two "views". The end-developer works on the logical view, and ZenStack intercepts the Prisma calls and translate them into appropriate queries and mutations to the physical view.

### Limitations

- Inheriting from multiple `@delegate` models is not supported yet.

- You cannot access base fields when calling `count`, `aggregate`, and `groupBy`. The following query is not supported:

    ```ts
    // you can't access base fields (`published` here) when aggregating
    db.post.count({ select: { published: true } });
    ```

- The enhanced `PrismaClient`'s typing doesn't preserve the typing changes made by Prisma client extensions.
