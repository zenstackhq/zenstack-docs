---
description: Prisma client extensions introduce a whole new level of extensibility. Let's explore its use cases and pitfalls.
tags: [prisma, database, zenstack]
image: ./cover.jpg
authors: yiming
date: 2023-03-12
---

# Prisma Client Extensions: Use Cases and Pitfalls

![Cover image](cover.jpg)

Although still experimental, [Client Extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions) are one of the most exciting features introduced in recent Prisma releases. Why? Because it opens a door for developers to inject custom behaviors into `PrismaClient` with great flexibility. This post shows a few interesting scenarios enabled by this feature, together with thoughts about where we should set the boundary to avoid overusing its power.

<!--truncate-->

## Background

Prior to the introduction of client extensions, [middleware](https://www.prisma.io/docs/concepts/components/prisma-client/middleware) was the only way to extend Prisma’s core runtime functionality - you can use it to make changes to the query arguments and alter the result. Client extensions are created as a future replacement to middleware with more flexibility and type safety. Here’s a quick list of things you can do with it:

-   Add a custom method to model

```ts
const xprisma = prisma.$extends({
    model: {
        user: {
            async signUp(email: string) {
                return prisma.user.create({ data: { email } });
            },
        },
    },
});

const user = await xprisma.user.signUp('john@prisma.io');
```

-   Add a custom method to client

```ts
const xprisma = prisma.$extends({
    client: {
        $log: (s: string) => console.log(s),
    },
});

prisma.$log('Hello world');
```

-   Add a custom field to query result

```ts
const xprisma = prisma.$extends({
    result: {
        user: {
            fullName: {
                // the dependencies
                needs: { firstName: true, lastName: true },
                compute(user) {
                    // the computation logic
                    return `${user.firstName} ${user.lastName}`;
                },
            },
        },
    },
});

const user = await xprisma.user.findFirst();
console.log(user.fullName);
```

-   Customize query behavior

```ts
const xprisma = prisma.$extends({
    query: {
        user: {
            async findMany({ model, operation, args, query }) {
                // inject an extra "age" filter
                args.where = { age: { gt: 18 }, ...args.where };
                return query(args);
            },
        },
    },
});

await xprisma.user.findMany(); // returns users whose age is greater than 18
```

## Use Cases

Client extensions are great for solving cross-cut concerns. Here’re a few use cases to stimulate your inspiration.

### 1. Soft delete

Soft delete is a popular way to handle deletion by putting a marker on entities without really deleting them so that the data can be quickly recovered when necessary. It's so widely desired that on Prisma's GitHub there's a long lasting issue about it - [Soft deletes (e.g. deleted_at) #3398](https://github.com/prisma/prisma/issues/3398).

With client extensions, you can implement soft delete in a central place. For example, suppose you have a schema like this:

```prisma
model User {
  id      Int     @id @default(autoincrement())
  email   String  @unique
  name    String?
  posts   Post[]
  deleted Boolean @default(false)
}

model Post {
  id       Int     @id @default(autoincrement())
  title    String
  content  String?
  author   User?   @relation(fields: [authorId], references: [id])
  authorId Int?
  deleted  Boolean @default(false)
}
```

Soft delete can be implemented like the following:

```ts
const xprisma = prisma.$extends({
    name: 'soft-delete',
    query: {
        $allModels: {
            async findMany({ args, query }) {
                // inject read filter
                args.where = { deleted: false, ...args };
                return query(args);
            },

            // ... other query methods like findUnique, etc.

            async delete({ model, args }) {
                // translate "delete" to "update"
                return (prisma as any)[model].update({
                    ...args,
                    data: { deleted: true },
                });
            },

            // ... deleteMany
        },
    },
});
```

All queries and mutations done with the `xprisma` client have soft delete behavior now. The benefit of implementing soft delete with client extensions is that, since client extensions don’t alter the behavior of the original prisma client, you can still use the original client to fetch all entities, including those marked as deleted.

A curious reader may find the sample implementation incomplete. Please read on; we’ll cover more of it in the Pitfalls part.

### 2. Limiting result batch size

Prisma’s `findMany` method returns all records by default, which can be an unwanted behavior for tables with many rows. We can use client extensions to add a safety guard:

```ts
const MAX_ROWS = 100;
const xprisma = prisma.$extends({
    name: 'max-rows',
    query: {
        $allModels: {
            async findMany({ args, query }) {
                return query({ ...args, take: args.take || MAX_ROWS });
            },
        },
    },
});
```

### 3. Logging

Logging is another very common cross-cut concern. Sometimes you want to log certain important CRUD operations, but turning on full logging on PrismaClient can be overwhelming. It’s now easy to achieve with client extensions.

```ts
const xprisma = prisma.$extends({
    name: 'logging',
    query: {
        post: {
            async delete({ args, query }) {
                const found = await prisma.post.findUnique({
                    select: { title: true, published: true },
                    where: args.where,
                });
                if (found && found.published) {
                    myLogger.warn(`Deleting published post: ${found.title}`);
                }
                return query(args);
            },
        },
    },
});
```

### 4. Enacting access control rules

Most database-driven applications have business rules for access control that must be consistently enforced across multiple feature areas. Traditionally the practice is to implement them at the API layer, but it’s prone to inconsistency. Prisma client extensions now offer the possibility to express them closer to the database.

Suppose you’re implementing APIs with Express.js; you can do it like this:

```ts
function getAuthorizedDb(prisma: PrismaClient, userId: number) {
    return prisma.$extends({
        name: 'authorize',
        query: {
            post: {
                async findMany({ args, query }) {
                    return query({ ...args, where: { authorId: userId } });
                },
                // ... other operations
            },
        },
    });
}

app.get('/posts', (req, res) => {
    const userId = req.userId; // provided by some authentication middleware
    return getPosts(getAuthorizedDb(userId));
});
```

The beauty of client extensions is that they share the same query engine and connection pool with the original prisma client that they’re based on, so the cost of creating them is very low, and you can do it at a per-request level, as shown in the code above.

## Limitations and Pitfalls

Client extensions are still fairly new, and they’re not without limitations and pitfalls. Here’re a few important ones that you may want to watch out for:

### 1. Strong typing doesn’t always work

Prisma does a great job of making sure things are always nicely typed. Even for client extensions, one important design goal is to support strong-typed programming when implementing an extension. However, as you can see in the “soft delete” example, it’s not consistently achievable for now.

### 2. Tendency to implement business logic with them

Client extensions allow you to add arbitrary methods into a model or the entire client. It can make it tempting for you to implement business logic with it. For example, you may want to add a `signUp` method to the User model, and besides creating an entity, also send an activation email. It will work, but your business code starts to creep into the database territory, making the code base harder to understand and troubleshoot.

However, as demonstrated previously, cross-cut concerns, like soft delete, logging, access control, etc., are very valid use cases.

### 3. Injecting filter conditions can be very tricky

As you’ve seen in use cases #1 and #4, we injected extra conditions into Prisma query args to achieve additional filtering. Unfortunately, neither is strictly correct. Prisma’s query API is very flexible for fetching relations. So for the "soft delete" example, besides handling top-level `findMany`, we also need to deal with relation fetching, like:

```ts
prisma.user.findMany({ include: { posts: true } });

// should be injected as
prisma.user.findMany({
	where: { deleted: false } },
	include: { posts: { where: { deleted: false } }
});
```

, and this needs to be processed recursively if you have a deep relation hierarchy. Beware that mutation methods, like `update`, `delete` suffer from the same problem because their result can carry relation data too by using the include clause. The example we used is a \*-to-many scenario. To-one relation is even harder to deal with because you can’t really attach a filter on the fetching of the to-one side of the relation. It’s very easy to make a leaky implementation.

All these complexities drove us to create the [ZenStack](https://zenstack.dev) toolkit for systematically enhancing Prisma and allowing you to model access-control concerns declaratively. The toolkit does the heavy lifting at runtime to ensure queries are properly filtered and mutations are guarded so that you don’t need to deal with all the subtleties yourself.
