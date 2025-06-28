---
description: Typing JSON fields
sidebar_position: 15
---

# Typing JSON Fields

> The design and implementation are inspired by [prisma-json-types-generator](https://github.com/arthurfiorette/prisma-json-types-generator).

Relational databases provide the benefit of strong schema enforcement, but sometimes, you want to step out of that guardrail and have more flexibility around data modeling. Prisma's JSON type allows you to store arbitrary JSON data in a column. It can be a good fit for use cases like:

- You want to store objects along with the main entity, but it's not worth creating a separate table for them.
- Your objects have many possible fields, but you don't want to create tables with wide columns.
- Your object's structure is not fixed and can change over time in a non-backward-compatible way.

JSON fields provide great flexibility but at the cost of losing strong typing and validation. ZenStack's strongly typed JSON field feature helps you regain the lost benefits.

## Defining types

To type JSON fields, you'll first need to create type declarations in your ZModel schema. For example, you can define a user profile type like:

```zmodel
type Profile {
  name String
  age Int
}
```

Types can include fields of other types too:

```zmodel
type Address {
  state String
  city String
  zip String
}

type Profile {
  name String
  age Int
  address Address?
}
```

Type declarations are similar to model declarations with the following differences:

- Types are not mapped to database tables.
- Types cannot inherit from other types yet. This will be supported in future releases.
- Types cannot have relations with models (since they aren't tables anyway).

## Defining strongly-typed JSON fields

You can then use these types to define strongly typed JSON fields in data models:

```zmodel
model User {
  id String @id @default(cuid())
  profile Profile @json

  @@allow('all', true)
}
```

:::info

Strongly typed JSON fields must be annotated with the `@json` attribute. The purpose is to make them easily distinguishable from relational fields.

The feature is only supported for PostgreSQL database for now.

:::

## `PrismaClient` typing

ZenStack's enhanced `PrismaClient` provides type-safe mutation input and query results for strongly typed JSON fields.

```ts
import { enhance } from '@zenstackhq/runtime';
import { prisma } from '~/db';

const db = enhance(prisma);

// The following create call results in a type error because of the
// incorrect type of the `age` field
await db.user.create({
  data: {
    profile: { name: 'Alice', age: '30' /* incorrect type */ }
  }
});

// The query result is typed as:
// {
//   id: string;
//   profile: {
//     name: string;
//     age: number;
//     address?: {
//       state: string;
//       city: string;
//       zip: string;
//     } | null;
//   };
// }
await user = await db.user.findFirstOrThrow();
```

The query also deals with transforming JSON fields into proper JavaScript types. For example, `DateTime` field values will be parsed from strings into `Date` objects.

Please note that ZenStack **DOES NOT** validate if the query result data conforms to the JSON field types. If you have non-conforming existing data, you'll have to do additional checking or transformation, instead of trusting the TypeScript typing. We thought this was a reasonable trade-off to preserve the flexibility of JSON fields.

:::info
Prisma filter clauses are not enhanced, which means when you filter by the JSON fields, you'll still need to use [Prisma's JSON filter syntax](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-a-json-field-simple).

In the future, we may provide a more natural filtering experience, like:

```ts
await db.user.findMany({
  where: {
    profile: { name: 'Alice' }
  }
});
```

However, it can potentially confuse code readers on whether the filter happens on a JSON field or a relational field (which involves joins). [Let us know your thoughts](https://discord.gg/Ykhr738dUe) on this!

:::

## Mutation payload validation

During mutation, the enhanced `PrismaClient` validates if the input data conforms to the JSON field type. Even if you bypass TypeScript's type checking, ZenStack will reject an incorrect payload with a runtime error.

```ts
await db.user.create({
  data: {
    email: 'abc',
    profile: { name: 'Alice', age: '30' /* incorrect type */ },
  },
} as any // bypass TypeScript type checking
);
```

```plain
Error calling enhanced Prisma method `user.create`: denied by policy: user 
entities failed 'create' check, input failed validation: Validation error: 
Expected number, received string at "profile.age"
```

You can also annotate the type declaration with additional [validation attributes](../reference/zmodel-language#data-validation):

```zmodel
type Profile {
  name String
  age Int @gte(18) @lt(150) // must be between 18 and 150
  address Address?
}
```

Such validations will also be enforced during mutation. For example, the following call will be rejected:

```ts
await db.user.create({
  data: {
    email: 'abc',
    profile: { name: 'Alice', age: 16 },
  },
});
```

```plain
Error calling enhanced Prisma method `user.create`: denied by policy: user
entities failed 'create' check, input failed validation: Validation error:
Number must be greater than or equal to 18 at "profile.age"
```

## TypeScript types

ZenStack generates TypeScript types for the "type" declarations. You can import them from `@zenstackhq/runtime/models`:

```ts
import type { Profile } from '@zenstackhq/runtime/models';

const profile: Profile = {
  name: 'Alice',
  age: 30,
  address: { state: 'WA', city: 'Seattle', zip: '98019' }
};
```

## Zod schemas

ZenStack also generates Zod schemas for the "type" declarations. You can import them from `@zenstackhq/runtime/zod/models`:

```ts
import { ProfileSchema } from '@zenstackhq/runtime/zod/models';

const profile = ProfileSchema.parse({
  name: 'Alice',
  age: 30,
  address: { state: 'WA', city: 'Seattle', zip: '98019' }
});
```

## Limitations

This feature is in preview and has the following limitations:

1. Only PostgreSQL database is supported.
1. Types cannot inherit from other types.
1. Models cannot inherit from types.
1. Types and abstract models are conceptually similar and they should probably be consolidated.
1. JSON field members cannot be used in access policies.

We would like to continue gathering feedback and address these limitations in future releases.
