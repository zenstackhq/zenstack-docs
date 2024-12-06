---
description: Integrating with Auth.js.
sidebar_position: 1
sidebar_label: Auth.js (NextAuth)
---

# Integrating With Auth.js (NextAuth)

[Auth.js](https://authjs.dev/) is a comprehensive framework for implementing authentication in full-stack projects. It offers a pluggable mechanism for configuring identity providers and storage systems.

How authentication is integrated with ZenStack is centered around extracting the current user from the authentication system and using it to create an enhanced `PrismaClient`. This guide briefly introduces the general flow. It uses Next.js (app router) to illustrate, but the same principles apply to other frameworks.

You can find a complete sample project [here](https://github.com/zenstackhq/sample-todo-nextjs-tanstack).

## Preparation

It's assumed that you've already set up a Next.js project following Auth.js's [guide](https://authjs.dev/getting-started), including creating an auth configuration, setting up auth providers, installing a storage adapter, and configuring Next.js middleware.

Follow the [installation guide](https://zenstack.dev/docs/install) to install ZenStack in your project.

Since you're using ZenStack in the project, you'll almost certainly use the [Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma) with Auth.js. Please follow its guide to configure the ZModel schema properly.

## Integrating with ZenStack

Auth.js provides a unified `auth()` backend API (returned by the [`NextAuth`](https://authjs.dev/reference/nextjs#nextauthresult) function) to retrieve the current validated login user. You can pass it to ZenStack's [`enhance()`](../../reference/runtime-api.md#enhance) API to create an enhanced `PrismaClient` that automatically enforces access policies.

The following sections illustrate various ways of using it.

### Using enhanced `PrismaClient` in server components

```ts title='src/app/some-page/page.tsx'
import { auth } from '~/auth';
import { prisma } from '~/db';
import Post from '~/components/Post';

export default function Page() {
  const authObj = await auth();
  const db = enhance(prisma, { user: authObj?.user });
  const posts = await db.post.findMany()

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} value={post} />
      ))}
    </div>
  );
}
```

### Using enhanced `PrismaClient` in route handler

```ts title='src/app/api/list-posts/route.ts'
import { auth } from '~/auth';
import { prisma } from '~/db';

export async function GET(request: Request) {
  const authObj = await auth();
  const db = enhance(prisma, { user: authObj?.user });
  return db.post.findMany()
}
```

### Mounting automatic CRUD API

You also can use ZenStack's [Next.js server adapter](../../reference/server-adapters/next.mdx) to serve a complete set of CRUD API automatically.

```ts title='src/app/api/model/[...path]/route.ts'
import { enhance } from '@zenstackhq/runtime';
import { NextRequestHandler } from '@zenstackhq/server/next';
import { auth } from '~/auth';
import { prisma } from '~/db';

async function getPrisma() {
  const authObj = await auth();
  return enhance(prisma, { user: authObj?.user });
}

const handler = NextRequestHandler({ getPrisma, useAppDir: true });

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT
};
```
