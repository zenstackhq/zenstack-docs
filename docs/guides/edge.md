---
description: Guide for deploying ZenStack to edge runtime.
sidebar_position: 12
---

# Deploying to Edge Runtime (Preview)

## Introduction

Edge Runtime is a kind of JavaScript runtime environment that allows code to run closer to the user's location, typically at the "edge" of the network. It can help improve the performance of web applications by reducing latency and increasing the speed of content delivery.

ZenStack is tested to work with Vercel Edge Runtime and Cloudflare Workers. Please [let us know](https://discord.gg/Ykhr738dUe) if you would like to see support for other environments.


## Edge-Compatible Database Drivers

ZenStack is built above Prisma, and Prisma's edge support was added recently and still evolving. The first thing you need to check is to make sure you use a edge-compatible database driver and Prisma adapter, or a traditional database with [Prisma Accelerate](https://www.prisma.io/docs/accelerate). Please check [this documentation](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/overview) for more details.

## Vercel Edge Runtime

You can enable edge runtime for a route by exporting a const named `runtime`. For example, for a RSC page:

```ts
import { createPrisma } from '~/lib/db';
import { getSessionUser } from '~/lib/auth';

export default async function Page() {
  ...

  // IMPORTANT: in edge environment you must create a new `PrismaClient` for each request
  // https://github.com/prisma/prisma/issues/20566#issuecomment-2021594203
  const prisma = createPrisma();
  const db = enhance(prisma, { user: getSessionUser() });
  const posts = await db.post.findMany();
  ...
}

export const runtime = 'edge';
```

The page component (which is an RSC) will run on the server side in edge environment. You can use a compatible `PrismaClient` enhanced by ZenStack in its implementation.

You can also run ZenStack's [Next.js server adapter](../reference/server-adapters/next) on the edge:

```ts title='/src/app/api/model/[...path]/route.ts'
import { NextRequestHandler } from '@zenstackhq/server/next';
import { createPrisma } from '~/lib/db';
import { getSessionUser } from '~/lib/auth';

function getEnhancedPrisma(req: Request) {
  // IMPORTANT: in edge environment you must create a new `PrismaClient` for each request
  // https://github.com/prisma/prisma/issues/20566#issuecomment-2021594203
  const prisma = createPrisma();
  return enhance(prisma, { user: getSessionUser(req) });
}

const handler = NextRequestHandler({ getPrisma: (req) => getEnhancedPrisma(req), useAppDir: true });

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

:::warning DO NOT REUSE Prisma Client

When targeting the edge runtime, it's important that you create a new `PrismaClient` instance for each request. Otherwise you can get unexpected behavior or errors. See [this comment](https://github.com/prisma/prisma/issues/20566#issuecomment-2021594203) for more details.

:::

You can use the "v2-edge" branch of [https://github.com/zenstackhq/sample-todo-nextjs-tanstack](https://github.com/zenstackhq/sample-todo-nextjs-tanstack/tree/v2-edge) as a reference.

### Caveats

`@zenstackhq/runtime` depends on `bcryptjs` which is not fully compatible with Vercel Edge Runtime. You may get the following error during compilation:

```
./node_modules/bcryptjs/dist/bcrypt.js
Module not found: Can't resolve 'crypto' in '.../node_modules/bcryptjs/dist'
```

To workaround this problem, add the following to the "package.json" file to avoid explicitly resolving the "crypto" module:

```json
{
  ...
  "browser": {
    "crypto": false
  }
}
```

## Cloudflare Workers

You can use ZenStack-enhanced `PrismaClient` in Cloudflare Workers. Here's an example for using with a Neon database. Please make sure to import `enhance` from `@zenstackhq/runtime/edge` instead of `@zenstackhq/runtime`.

```ts
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import { enhance } from '@zenstackhq/runtime/edge';
import { getSessionUser } from './auth';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const neon = new Pool({ connectionString: env.DATABASE_URL });
    const adapter = new PrismaNeon(neon);
    const prisma = new PrismaClient({ adapter });
    const db = enhance(prisma, { user: getSessionUser(request) });
    const posts = await db.post.findMany();  
    return Response.json(posts);
  }
};
```

:::info
Cloudflare's [D1 database](https://developers.cloudflare.com/d1/) is not yet supported by ZenStack due to its lack of support for interactive transactions.
:::

ZenStack currently doesn't have adapters for edge-first server frameworks like [hono](https://hono.dev/). Please create a [feature request](https://github.com/zenstackhq/zenstack/issues/new?template=feature_request.md&title=%5BFeature+Request%5D) if you have a need for it.
