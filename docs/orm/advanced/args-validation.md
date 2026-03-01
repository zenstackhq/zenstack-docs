---
sidebar_position: 2
description: Validating CRUD operation input
---

import AvailableSince from '../../_components/AvailableSince';

# Validating Query Args

<AvailableSince version="v3.4.0" />

ZenStack ORM's query input format is very flexible. Internally, the ORM uses [Zod](https://zod.dev) schemas to systematically validate the args before further processing them. The same facility is exposed with the `$zod` property of the ORM client. It can be useful if you build your own layers above ZenStack that eventually pass dynamically generated queries to the ORM.

:::info
This set of input validation Zod schemas are not to be confused with the high-level [Zod](../../utilities/zod) utility, which provides validation for models and types defined in ZModel, instead of ORM query input.
:::

## Basic Usage

Access the schema factory via `db.$zod`, then call the appropriate `make*Schema` method with a model name. The result is a fully-typed Zod schema that you can use to validate data, or further composed with other schemas.

```ts
const db = new ZenStackClient(schema, { ... });

// Create a Zod schema for the `findMany` operation on `User`
const findManySchema = db.$zod.makeFindManySchema('User');

// Validate input
const result = findManySchema.safeParse(userInput);
if (!result.success) {
  // Handle validation errors
  console.error(result.error.issues);
}
```

The ORM query APIs (e.g., `findMany`, `create`, `update`, etc.) are one-to-one mapped to the zod schema factory methods.

## Schema Features

The created Zod schemas have the following features:

1. They are strongly typed.
1. They verify the basic shapes of input args (object fields and types).
1. They respect the additional validation attributes like `@email`, `@length`, etc., as described in [Input Validation](../validation.md).
1. They respect the ORM client's options that affect the shape of the args, e.g. [API Slicing](./slicing.md).

## Controlling Relation Depth

By default, generated schemas allow unlimited nesting of relations. This can result in a deep cyclic graph if you have many models with complex relations.

You can control how many levels of relations to include with the `relationDepth` option:

```ts
// No relation nesting allowed - only scalar fields
const schema = db.$zod.makeFindManySchema('User', { relationDepth: 0 });

schema.safeParse({ where: { email: 'test@example.com' } }); // valid
schema.safeParse({ where: { posts: { some: { published: true } } } }); // invalid
schema.safeParse({ include: { posts: true } }); // invalid

// Allow one level of relation nesting
const schema1 = db.$zod.makeFindManySchema('User', { relationDepth: 1 });

schema1.safeParse({ include: { posts: true } }); // valid
schema1.safeParse({
  select: { posts: { select: { comments: true } } }, // 2 levels - invalid
});
```

This is useful for scenarios like:
- Limiting the complexity of queries accepted by your API endpoints.
- Passing the schemas as part of tool definition to an LLM while reducing the size of context window they occupy.
