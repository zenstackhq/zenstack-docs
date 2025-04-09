---
title: ZenStack - The Next Chapter (Part I)
description: Looking into the future of ZenStack.
tags: [zenstack]
authors: yiming
image: ./cover.png
date: 2025-04-08
---

# ZenStack - The Next Chapter (Part I)

![Cover Image](./cover.png)

Back in late 2022, when Jiasheng and I discussed how to make building web apps less painful, we initially thought of building something for people without a programming background. We eventually couldn't convince ourselves it could work, so we decided to take a step back and try to make developers' lives easier. That "step back" became the start of [ZenStack](https://zenstack.dev).

The past two and half years have been full of joy and fulfillment. By building the tool, seeing how people use it, and learning what works and what doesn't, we've got a better understanding of the intricacy of "easy". What people need is not just writing less code or shipping faster, but rather an inexplicable balance between low cognition burden and high flexibility. We are probably on the right track to solving the problem, but there's still a long way ahead. While considering what to do in V3, we think it's a good time to better align ZenStack's architecture with the ultimate goal.

<!-- truncate -->

## A retrospect

ZenStack started its journey as a powerful extension package to Prisma ORM. It's been advocating a model-first approach, which is to use a rich and coherent schema as the core of an application and, from it, automatically derive as many workpieces as possible - access control, RESTful APIs, frontend hooks, Zod schemas, etc. As we went deeper into this path, we started to feel more and more constrained by our foundation - Prisma. Here are some of the most important limitations.

### 1. You can't control the SQL to be executed

One of the most significant extensions ZenStack made to Prisma is access control. It works by injecting into PrismaClient's queries. For example, with the following schema

```tsx
model User {
  id Int @id
  posts[] Post
  // user can be read if he has at least one published post
  @@allow('read', posts?[published == true])
}
```

, a query like the following

```tsx
db.user.findFirst()
```

becomes this after ZenStack’s injection:

```tsx
db.user.findFirst({ where: { posts: { some: { published: true } } } })
```

It all works great until you run into a requirement that [can't be expressed with a Prisma query](https://github.com/prisma/prisma/issues/8935), like:

```sql
model User {
  ...
  // A user is readable if he has more than one post
  // The policy rule is pseudo and currently unsupported in ZenStack
  @@allow('read', count(posts) > 1)
}
```

But it can be easily achieved with SQL:

```sql
SELECT u.*
FROM "User" u
JOIN "Post" p ON u."id" = p."authorId"
GROUP BY u."id"
HAVING COUNT(p."id") > 1;
```

Since Prisma doesn't provide a way to intercept and alter the SQL (or its equivalence) before execution, we don't have the option to inject at a lower level.

### 2. Lacking a (good enough) escape hatch

Prisma's query API is great, but when your requirements outgrow its capability, you'll need to resort to SQL. This is not ideal for several reasons:

- Writing SQL can be challenging for developers and feels like a considerable DX degradation compared to the awesome fully-typed query API
- SQL codes are quite often not portable between different database types
- People have repeatedly asked if "ZenStack supports access control for raw SQL or typed-SQL". We don't want to get into the business of parsing and injecting multiple dialects of SQL.

Instead, a query-builder style API can probably cover most use cases where raw SQL is needed and provides a much better DX experience while making injection a lot easier.

### 3. Excessive stack complexity

Sitting above Prisma, ZenStack needs to interface with Prisma at multiple levels:

- Transpiling ZModel to Prisma Schema
- Manipulating Prisma-generated TypeScript types
- Generating more code (Zod, frontend hooks, etc., based on [Prisma’s DMMF](https://github.com/prisma/prisma/blob/main/ARCHITECTURE.md#the-dmmf-or-data-model-meta-format))
- Intercepting PrismaClient APIs at runtime

Besides implementation complexity, a significant price that this design pays is the slow code generation process for large schemas.

Despite these claims, we don't intend to say Prisma is incompetent in any way. Quite on the contrary, we love it, learned a lot from it, and think it's the best in class for many typical applications. We're simply reaching the conclusion that Prisma is not the best abstraction level that ZenStack builds above to achieve our vision of the project.

## What's next?

The two primary goals we want to achieve with V3 are:

- Better flexibility
- Snappier DX

The plan is to migrate away from Prisma and reimplement the core ORM part with [Kysely](https://kysely.dev/). We know it sounds very bold and even scary for current ZenStack users. What about backward compatibility? Why Kysely?

### Backward compatibility

Despite the big refactor, the following compatibility guarantees will be kept:

1. ZModel will be fully backward compatible.
2. The new ORM CRUD API will be fully compatible with `PrismaClient`.
3. Migrations previously generated with Prisma will continue to work (we'll likely continue using Prisma for database migration for a while).

These should minimize the need for code changes during the upgrade. However, it doesn't mean no changes at all. For example, if you reference Prisma-generated TypeScript types explicitly, such references may need to be updated.

One fuzzy area is Prisma's client extensions. Given the many limitations of its design, we're not sure if making a compatible implementation is a good idea. We'll share more thoughts about extensibility in the follow-up posts.

### Why Kysely?

Kysely is a very popular, strongly typed SQL query builder. Using it as the database access layer can address several limitations mentioned previously.

1. ZenStack can provide strongly typed ORM API (as `PrismaClient`) as well as strongly typed low-level query builder API. A query builder can almost express everything SQL can, with a much better DX. This is similar to what [Drizzle](https://orm.drizzle.team/) offers.
   
2. Access control injection (and other query transformations) can be done at Kysely's query tree level, which offers much more flexibility than injecting `PrismaClient`.
   
3. Kysely's expression builder can be used as a generic extensibility mechanism (more about this in the next post).

One question we repeatedly got was, "Why not build above Drizzle, given its rising popularity?". Drizzle is an excellent ORM that addresses some of Prisma's issues. However, the primary decision factor is the abstraction level. ZenStack needs a simple yet flexible database access layer as a foundation. Kysely satisfies this criterion perfectly, while Prisma, Drizzle, and other ORMs are too high-level and comprehensive.


## Tell us what you think

Such a big refactor is always challenging and exciting at the same time. We believe it's necessary and will pave the road for ZenStack's future - a versatile ORM, a secured data layer, an API generator, and an indispensable tool for full-stack development. [Let us know your thoughts!](https://discord.com/channels/1035538056146595961/1352359627525718056)
