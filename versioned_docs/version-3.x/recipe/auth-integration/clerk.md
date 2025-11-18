---
description: Integrating with Clerk.
sidebar_position: 2
sidebar_label: Clerk
---

# Clerk Integration

[Clerk](https://clerk.com/) is a comprehensive authentication and user management platform, providing both APIs and pre-made UI components. This guide will show you how to integrate Clerk with ZenStack's [access control system](../../orm/access-control/).

### Set up Clerk

First, follow Clerk's [quick start guides](https://clerk.com/docs/quickstarts/overview) to set up your project if you haven't already.

### Adjust your ZModel

Since Clerk manages both user authentication and storage, you don't need to store users in your database anymore. However, you still need to provide a type that the `auth()` function can resolve to. Instead of using a regular model, we can declare a `type` instead:

You can include any field you want in the `User` type, as long as you provide the same set of fields in the context object when calling `ZenStackClient`'s `$setAuth()` method.

The following code shows an example blog post schema:

```zmodel
type User {
  id String @id

  @@auth
}

model Post {
  id String @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title String
  published Boolean @default(false)
  authorId String // stores Clerk's user ID

  // author has full access
  @@allow('all', auth() != null && auth().id == authorId)

  // logged-in users can view published posts
  @@allow('read', auth() != null && published)
}
```

If you choose to [synchronize user data to your database](https://clerk.com/docs/users/sync-data-to-your-backend), you can define `User` as a regular `model` since it's then backed by a database table.

### Create a user-bound ORM client

When using ZenStack's built-in access control, you often use the `auth()` function in policy rules to reference the current user's identity. The evaluation of `auth()` at runtime requires you to call the `$setAuth()` method and pass in the validated user identity from Clerk. 

Please refer to clerk's documentation on how to fetch the current user on the server side for your specific framework. The following code shows an example for Next.js (app router):

```ts
import { auth } from "@clerk/nextjs/server";

// ZenStack ORM client with access policy plugin installed
import { authDb } from './db'; 

async function getUserDb() {
  // get the validated user identity from Clerk
  const authObject = await auth();

  // create a user-bound ORM client
  return authDb.$setAuth(
    authObject.userId ? { id: authObject.userId } : undefined);
}
```
