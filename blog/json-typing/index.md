---
title: "Typing Those JSON Fields? Yes, You Can!"
description: This post introduces the new strongly typed JSON field feature in ZenStack.
tags: [prisma]
authors: yiming
date: 2024-11-06
image: ./cover.png
---

# Typing Those JSON Fields? Yes, You Can!

![Cover Image](cover.png)

SQL databases provide us with many benefits, the most important of which is strong schema enforcement. Yes, you pay the cost of migration when the schema changes, but the gain is far more significant - your code is clean because it can assume all data are in correct shapes.

However, once in a while, we want to break free from such strong guarantees for valid reasons. You may have some tiny objects that you want to attach to the main entities (e.g., metadata of an image) without formalizing them into a separate table. Or you need to store records with many possible sparse fields but want to avoid creating wide tables.

Prisma's JSON type provides a generic escape hatch for such scenarios. It allows storing arbitrary data and gives you a generic `JsonValue` type in the query results.

```zmodel title="schema.prisma"
model Image {
  id Int @id @default(autoincrement())
  metadata Json
}
```

```ts title="main.ts"
type Metadata {
  width: number
  height: number
  format: string
}

const image = await prisma.image.findFirstOrThrow();
// an explicit cast into the desired type
const metadata = image.metadata as Metadata;
console.log('Image dimensions:', metadata.width, 'by', metadata.height);
```

This is not always ideal because, in practice, many people use JSON type in a "controlled" way - only data of specific fixed shapes are stored in a field. So, regaining some of the strong typing capabilities would be very beneficial.

ZenStack's new "strongly typed JSON field" feature is designed to address this need. It allows you to define shapes of JSON data in the schema, and "fixes" `PrismaClient` to return data with correct types. The feature is in preview and only supports PostgreSQL for now.

## Using strongly typed JSON fields

The first step is to use the new `type` keyword to define the shape of the JSON data in the ZModel schema:

```zmodel title="schema.zmodel"
type Metadata {
  width Int
  height Int
  format String
}

model Image {
  id Int @id @default(autoincrement())
  metadata Metadata @json
}
```

Types have a structure similar to models but are not mapped to database tables. They only exist for typing and validation purposes. You can not have relations to other models in types. However, you can include fields of other types to form a nested structure.

When you run `zenstack generate`, the compiler will transform the typed JSON fields back into the regular Prisma `Json` type:

```zmodel title="schema.prisma"
model Image {
  id Int @id @default(autoincrement())
  metadata Json
}
```

So, where did the `Metadata` type go? It's compiled into a TypeScript type declaration, which is used to type the query results when you use the ZenStack-enhanced `PrismaClient`:

```ts title="main.ts"
import { enhance } from '@zenstackhq/runtime';

const db = enhance(prisma);
const image = await db.image.findFirstOrThrow();

// image.metadata is now directly typed as { width: number, height: number, format: string }
console.log('Image dimensions:', image.metadata.width, 'by', image.metadata.height);
```

When you create or update, the input is also properly typed so you get nice auto-completion and typechecking for the payload:

```ts title="main.ts"
await db.image.create({
  data: {
    metadata: {
      width: 1920,
      height: '1080', // <- type error here
      format: 'jpeg'
    }
  }
});
```

Straightforward, isn't it? But the feature doesn't stop here.

## How about some runtime validation?

For mutations, ZenStack also validates the input data's shape at runtime by deriving a Zod schema from the type declaration. You can also add additional constraints to fields the same way you can do with models:

```zmodel title="schema.zmodel"
type Metadata {
  width Int @gt(0) @lt(10000)
  height Int @gt(0) @lt(10000)
  format String
}
```

Mutation calls violating these constraints will be rejected:

```ts title="main.ts"
await db.image.create({
  data: {
    metadata: {
      width: 1920,
      height: 10800, // <- runtime error here
      format: 'jpeg'
    }
  }
});
```

```plain
Error calling enhanced Prisma method `image.create`: denied by policy: image entities failed 'create' check, 
input failed validation: Validation error: Number must be less than 10000 at "metadata.height"
```

## Is it really type-safe?

JSON fields are meant to hold arbitrary data types, so there isn't really a way to guarantee data consistency. As such, to preserve enough flexibility, ZenStack doesn't validate if the query results comply with the type declaration. This effectively means you can't trust the TypeScript typings alone if you know the column contains mixed data.

One way to mitigate the problem is to validate the data with the generated Zod schemas explicitly:

```ts
import { MetadataSchema } from '@zenstackhq/runtime/zod/models';

const image = await db.image.findFirstOrThrow();
const metadata = MetadataSchema.parse(image.metadata);
```

## Next steps

One area that's not addressed by this feature yet is the filtering part. The `where` clause still follows Prisma's [Json filter format](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-a-json-field-simple):

```ts title="main.ts"
// find images with width greater than 102
const images = await db.image.findMany({
  where: {
    metadata: { path: ['width'], gt: 1024 }
  }
});
```

We can potentially "enhance" that part to provide a typed experience like:

```ts title="main.ts"
const images = await db.image.findMany({
  where: {
    metadata: { width: { gt: 1024 } }
  }
});
```

Is it useful, or can it be confusing (as it looks the same as relation filters)? Let us know by leaving a comment below. You can also learn more about this feature in the [official guide](https://zenstack.dev/docs/guides/typing-json).
