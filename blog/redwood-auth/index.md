---
description: RedwoodJS is an excellent full-stack framework that bundles many tools for building modern web applications. This post explores an alternative way of implementing authorization in RedwoodJS projects when its built-in RBAC is not sufficient.
tags: [fullstack, authorization]
authors: yiming
image: ./cover.png
date: 2023-06-22
---

# Implementing Flexible Authorization in RedwoodJS Projects

![Cover image](cover.png)

[RedwoodJS](https://redwoodjs.com) is an opinionated full-stack framework for building modern web applications. It makes some of the most critical decisions for you - like using React for UI development, GraphQL for API, and Prisma for database programming, etc. - so you can stop struggling with choices and focus on building your app.

Regarding authorization, RedwoodJS has built-in support for RBAC (Role-Based Access Control), which can work well for simple apps but can easily hit its limit for complex scenarios. In this article, we'll explore an alternative way of implementing authorization that may surprise you. Instead of doing it at the GraphQL API and service code level, we move it down to the ORM layer.

<!-- truncate -->

## The Scenario

Every RedwoodJS user started through the official tutorial, a simple blog app. It has a `User` system, a `Post` model representing a blog post, which has a one-to-many relationship to a `Comment` model representing a comment on a post.

The tutorial demonstrated RBAC by implementing the following requirements:

- Any user can read posts and comments.
- Users with "admin" role can create posts, and update/delete their own posts.
- Any user can create and read comments.
- Users with "moderator" role can delete comments.

These requirements are implemented nicely using the `@requireAuth` GraphQL directive and the `requireAuth` service helper. For example:

```graphql title='api/src/graphql/adminPosts.sdl.js'

type Mutation {
  createPost(input: CreatePostInput!): Post! @requireAuth(roles: ["admin"])
  updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth(roles: ["admin"])
  deletePost(id: Int!): Post! @requireAuth(roles: ["admin"])
}
```

```js title='api/src/services/comments/comments.js'

export const deleteComment = ({ id }) => {
  requireAuth({ roles: 'moderator' })
  return db.comment.delete({
    where: { id },
  });
}

```

Now let's tweak the requirements a little bit and let it go beyond simple RBAC by adding the following rules:

- `Post` has an extra `published` property indicating if it's published.
- Unpublished posts cannot be viewed (except by "admin" users in the admin UI).
- Comments cannot be viewed or created for unpublished posts.

Our authorization model has evolved from a pure RBAC to a hybrid of RBAC and ABAC (Attribute-Based Access Control).

## Extending Current Implementation

The most straightforward way to implement the new requirements is to add more logic into the service layer:

```diff title='api/src/services/posts/posts.js'

export const posts = (...args) => {
  return db.post.findMany(
+ { 
+   where: { published: true }
+ }
  );
}

```

```diff title='api/src/services/comments/comments.js'

export const comments = ({ postId }) => {
  return db.comment.findMany({
    where: {
-     postId      
+     AND: [
+       { postId },
+       { post: { published: true } }
+     ]
    }
  });
}

export const createComment = ({ input }) => {
+ const post = await db.post.findUnique({ where: { id: input.postId } });
+ if (!post.published) {
+   throw new ForbiddenError('Cannot create comment for unpublished post');
+ }
  return db.comment.create({
    data: input,
  });
}

```

Although this works, our authorization logic has started to creep into many places in the code base, and the system gets harder to reason about and maintain.

Let's try a different approach.

## Letting ORM Do the Heavy Lifting

All the authorization logic eventually does one thing: prevent data that shouldn't be read or modified from being read or modified - in other words, it's a data filter. Who lives closer to the data? Yes, the ORM! Why not let it do the heavy lifting for us?

In this post, we will achieve the goal of implementing authorization in the ORM layer with the [ZenStack](https://zenstack.dev) toolkit. ZenStack is a NodeJS toolkit built above Prisma. It extends Prisma's power in many ways, and "adding access control" is the most important one.

Here's how it goes.

### 1. The Modeling Part

ZenStack uses a schema language called "ZModel" to model data and access control policies. ZModel is a superset of Prisma's schema language. Its data modeling part is essentially the same as in Prisma but with additional attributes for expressing access policy rules (the `@@allow` attribute shown below).

Here's how our `Post` and `Comment` models look like in ZModel:

```zmodel title='api/schema.zmodel'

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  comments  Comment[]
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime @default(now())
  published Boolean @default(false)

  // 🔐 Admin user can do everything to his own posts
  @@allow('all', auth().roles == 'admin' && auth() == user)

  // 🔐 Posts are visible to everyone if published
  @@allow('read', published)
}

model Comment {
  id        Int      @id @default(autoincrement())
  name      String
  body      String
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
  createdAt DateTime @default(now())

  // 🔐 Moderator user can do everything to comments
  @@allow('all', auth().roles == 'moderator')

  // 🔐 Everyone is allowed to view and create comments for published posts
  @@allow('create,read', post.published)
}

```

That's it! We've expressed all the authorization rules in the schema, centralized and concise. The flexibility of the rule syntax allows you to implement a particular authorization model that doesn't strictly follow any predefined paradigm. Your schema is now the single source of truth for the two most important and closely related things: data and authorization.

The `zenstack` CLI compiles ZModel down to a plain Prisma schema (stripping the policy parts) which can be used in your current Prisma workflows (generation, migration, etc.). The access policies are transformed into metadata objects that'll support the enforcement of the policy rules at runtime.

### 2. The Runtime Part

In the service code, we'll use ZenStack's runtime API to create "enhanced" Prisma Client instances that are aware of the access policies. Such instances are transparent proxies, so they have the same API as the original Prisma Client. They intercept CRUD calls, apply policy checks, and make injections into the Prisma query as necessary.

:::info
The enhanced Prisma Client rejects all CRUD calls by default. You must set rules to grant permissions.
:::

We can adopt it in two steps:

1. Add a helper to create an enhanced client for the current user

    ```js title='api/src/lib/db.js'
    import { enhance } from '@zenstackhq/runtime';

    /*
     * Returns ZenStack wrapped Prisma Client with access policies enabled.
     */
    export function authDb() {
      return enhance(db, { user: context.currentUser });
    }

    ```

1. Change the service code to use the enhanced client

    ```js title='api/src/services/posts/posts.js'

    export const posts = () => {
      return authDb().post.findMany();
    }

    ```

    ```js title='api/src/services/comments/comments.js'

    export const comments = ({ postId }) => {
      return authDb.comment.findMany();
    }

    export const createComment = ({ input }) => {
      return authDb().comment.create({
        data: input,
      });
    }

    ```

    :::info
    It's crucial to call `authDb()` each time and not cache the result to capture the current user correctly.
    :::

    As you can see, except for using the `authDb()` helper, we've removed all imperative authorization code from the service layer. However, our backend is still secure because the access policies are enforced by the ORM.

## Conclusion

Authorization is a very challenging topic, no matter what framework you choose to use. This post demonstrated how ZenStack could help you implement authorization in a centralized, concise, and declarative way. You can find the full project code below:

>[https://github.com/zenstackhq/sample-redwood-blog](https://github.com/zenstackhq/sample-redwood-blog)

If you'd like to learn more about ZenStack, check out this comprehensive introduction [here](https://zenstack.dev/docs/intro/).

We created ZenStack based on this belief:

> Since authorization is mainly about data, it should be modeled together with data and enforced close to the data.

Do you share the same view? Yes or no, join our [Discord community](https://go.zenstack.dev/chat) and let us know your thoughts!

