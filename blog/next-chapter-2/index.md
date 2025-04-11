---
title: ZenStack - The Next Chapter (Part II. An Extensible ORM)
description: This post explores how ZenStack V3 will become a more extensible ORM.
tags: [zenstack]
authors: yiming
image: ./cover.png
date: 2025-04-10
---

# ZenStack - The Next Chapter (Part II. An Extensible ORM)

![Cover Image](./cover.png)

In the [previous post](../next-chapter-1/index.md), we discussed the general plan for ZenStack v3 and the big refactor. This post will explore the extensibility opportunities the new architecture brings to the core ORM.

<!-- truncate -->

## High-Level CRUD and Low-Level Query Builder

While continuing to provide the fully typed CRUD API like `PrismaClient` (`findMany`, `create`, etc.), using [Kysely](https://kysely.dev/) as the underlying data access layer allows us to easily offer a low-level, query-builder style API too.

```ts
// CRUD API (the same as PrismaClient)
await db.user.findMany({ include: { posts: true } });

// Query builder API (backed by Kysely)
await db.$qb.selectFrom('User')
  .leftJoin('Post', 'Post.authorId', 'User.id')
  .select(['User.id', 'User.email', 'Post.title'])
  .execute()
```

Both the CRUD API and the query builder API are automatically inferred from the ZModel schema, so you don't need any extra configuration to use them, and they're always consistent. Given Kysely query builder's awesome flexibility, we believe you'll rarely need to resort to raw SQL anymore.

What's even more powerful is that you can blend query builder into CRUD calls. For complex queries, you can still enjoy the terse syntax of the CRUD API, and mix in the query builder for extra expressiveness. Here's an example:

```ts
await db.user.findMany({
  where: {
    age: { gt: 18 },
    // "eb" is a Kysely expression builder
    $expr: (eb) => eb('email', 'like', '%@zenstack.dev')
  }
});
```

It's similar to the long-awaited [whereRaw](https://github.com/prisma/prisma/issues/5560) feature request in Prisma, but better thanks to Kysely's type-safe query builder. You can implement arbitrarily complex filters involving joins or subqueries with the `$expr` clause.

Kysely's query builder syntax may take some time to get used to, but once you get the hang of it, it's pleasant to write and incredibly powerful.

## Computed Fields

One major limitation of Prisma and ZenStack v2 is the lack of real "computed fields". Prisma's client extension allows you to [add custom fields to models](https://www.prisma.io/docs/orm/prisma-client/queries/computed-fields), but it's purely client-side. It's good for simple computations like combining `firstName` and `lastName` into full name, but you can't do anything that needs database-side computation, like adding a `postCount` field to return the number of posts a user has. 

ZenStack v3 is determined to solve this problem. It'll introduce a new `@computed` attribute that allows you to define computed fields in ZModel.

```zmodel
model User {
  id Int @id
  posts[] Post
  postCount Int @computed
}
```

Of course, you'll need to provide an "implementation" for computing the field, on the database side. Again, Kysely's query builder is perfect for this. When creating a ZenStack client instance, you'll need to provide a callback that returns a Kysely expression builder for each computed field.

```ts
import { ZenStackClient } from '@zenstackhq/runtime';

const client = new ZenStackClient({
  computed: {
    user: {
      // select count(*) as postCount from Post where Post.authorId = User.id
      postCount: (eb) =>
        eb
          .selectFrom('Post')
          .whereRef('Post.authorId', '=', 'User.id')
          .select(({ fn }) => fn.countAll<number>().as('postCount'))
    }
  }
});
```

Then, when you query the `User` model, the `postCount` field will be returned in the result. You can also use it to filter, sort, etc., just like any other field.

```ts
// find users with more than 10 posts and sort by post count
const users = await client.user.findMany({
  where: { postCount: { gt: 10 } },
  orderBy: { postCount: 'desc' }
});
```

Since the fields are declared in ZModel, you can use it in access policies as well:

```zmodel
model User {
  ...
  @@deny('delete', postCount > 0)
}
```

Another benefit of having the computed fields declared in ZModel is that it'll be visible to all tools that consume the schema. For example, The OpenAPI spec generator can include them as fields in the generated APIs.

## Custom Procedures

An ORM provides a set of data access primitives that allow applications to compose them into higher-level operations with business meaning. Such composition can be encapsulated in many ways: utility functions, application services, database stored procedures, etc. ZenStack v3 will introduce a new `proc` construct to allow defining such encapsulation in ZModel.

```zmodel
model User {
  id Int @id
  email String @unique
  name String?
}

type SignUpInput {
  email String
  name String?
}

proc signUp(args: SignUpInput): User
```

Again, when creating a ZenStack client instance, you must provide implementations for the procedures.

```ts
import { ZenStackClient } from '@zenstackhq/runtime';

const client = new ZenStackClient({
  procs: {
    signUp: async (client, args) => {
      // create user
      const user = await client.user.create({ data: { email: args.email, name: args.name } });
      // send a welcome email
      await sendWelcomeEmail(user.email);
      return user;
    }
  }
});
```

Then, you can call the type-safe procedures just like any other CRUD operation:

```ts
const user = await client.$procs.signUp({ email, name });
```

You may wonder why we bother to declare the procedure in ZModel. Again, the purpose is to make them visible to upstream tools. For example, ZenStack's auto CRUD Http API can expose them as endpoints:

```bash
POST /api/$procs/signUp
{
  "email": ...,
  "name": ...
}
```

And, for the frontend, TanStack query hooks can be used to call the procedures:

```tsx
import { useHooks } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/schema';

export default function SignUp() {
  const crud = useHooks(schema);
  const { mutateAsync: signUp } = crud.$procs.signUp();

  const handleSubmit = async (data) => {
    await signUp(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

Combined with access policies, custom procedures provide a powerful way to encapsulate complex business logic and expose them as APIs with minimum effort.

## Conclusion

ZenStack v3 will be a big step forward in terms of extensibility and flexibility. The new architecture allows us to provide a more powerful and expressive ORM experience while still maintaining simplicity and ease of use.

In the next post, we'll continue to explore how the new plugin system will allow you to make deep customizations to ZenStack in a clean and maintainable way.
