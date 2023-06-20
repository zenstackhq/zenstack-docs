---
description: Enhanced Prisma Client
sidebar_label: 3. Enhanced Prisma Client
sidebar_position: 3
---

# Enhanced Prisma Client

The ZModel language allows us to enrich our data models with semantics that couldn't be done with Prisma. Similarly, at runtime, ZenStack provides APIs that ***enhance*** Prisma Client instances. These enhancements are transparent proxies, so they have exactly the same APIs as the regular Prisma Client but add additional behaviors.

The most interesting enhancement is the enforcement of access policies. Let's say we have the following ZModel:

```prisma
model User {
    id Int @id
    posts Post[]

    // user-related access policies are omitted
    // ...
}

model Post {
    id Int @id
    title String @length(5, 255)
    published Boolean @default(false)
    author User @relation(fields: [authorId], references: [id])
    authorId Int

    // 🔐 author has full access
    @@allow('all', auth() == author)

    // 🔐 logged-in users can view published posts
    @@allow('read', auth() != null && published)
}
```

You can see how the enhancement works in the following code snippet:

```ts

// create a regular Prisma Client first
const prisma = new PrismaClient();

// create two users and a post for each

// user#1 => post#1
await prisma.user.create({
    data: {
        id: 1,
        posts: { create: [{ id: 1, title: 'Post 1' }] }
    }
})

// user#2 => post#2
await prisma.user.create({
    data: {
        id: 2,
        posts: { create: [{ id: 2, title: 'Post 2' }] }
    }
})


// the call below returns all posts since there's no filtering
const posts = await prisma.post.findMany();
assert(posts.length == 2, 'should return all posts');

// create a policy-enhanced wrapper with a user context for user#1
import { withPolicy } from '@zenstackhq/runtime';
const enhanced = withPolicy(prisma, { user: { id: 1 }});

// even without any filtering, the call below only returns
// posts that're readable by user#1, i.e., [post#1]
const userPosts = await enhanced.post.findMany();
assert(userPosts.length == 1 && userPosts[0].id == 1], 'should return only post#1');

// ❌ the call below fails because user#1 is not allowed to update post#2
await enhanced.post.update({
    where: { id: 2 },
    data: { published: true }
});

// ❌ the call below fails because "title" field violates the `@length` constraint
await enhanced.post.create({
    data: { title: 'Hi' }
});

```

When building a backend service, you can centralize authorization concerns into the schema using access policies and then use the enhanced Prisma Client across your service code. This practice can bring three clear benefits:

- A smaller code base.
- A more secure and reliable result compared to manually writing authorization logic.
- Better maintainability since when authorization rules evolve, the schema is the only place where you need to make changes.

You can find more information about access policies [here](/docs/guides/understanding-access-policy).

In fact, you may not need to implement a backend service at all if the service is mainly CRUD. With an access-control-enhanced Prisma Client, a full-fledged CRUD service can be generated automatically. Let's see how it works in the next section.