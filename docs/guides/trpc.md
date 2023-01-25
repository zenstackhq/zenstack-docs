---
description: Steps for using ZenStack with tRPC.
sidebar_position: 7
---

# Using With tRPC

[tRPC](https://trpc.io) is a fantastic library that magically turns server-side procedures into client-callable functions without requiring you to provide any official contract. The popular [T3 stack](https://create.t3.gg/) promotes the combo of Prisma + tRPC for achieving type safety from your frontend all the way down to the database.

ZenStack makes things even easier by automatically generating tRPC routers from the ZModel schema. You can use the generated routers together with an enhanced Prisma client; since the Prisma client has the ability to enforce access policies, there is no need to implement authorization code anymore.

## Details

You can enable tRPC router generation with the `@zenstackhq/trpc` plugin.

```prisma title='/schema.zmodel'

plugin trpc {
    provider = '@zenstackhq/trpc'
    output = 'server/routers/generated'
}

```

When you run `zenstack generate` again, you should find a bunch of tRPC routers generated in the output folder, one per each data model. A `createRouter` helper function is also generated, which returns a router instance for all models. You can use it as your top-level tRPC router, or merge it with other routers to form a more complex setup.

```ts title='/src/server/routers/_app.ts'
import { createRouter } from './generated/routers';

const t = initTRPC.context<Context>().create();

export const appRouter = createRouter(t.router, t.procedure);

export type AppRouter = typeof appRouter;
```

:::tip

If your data model uses field types that're not JSON-serializable, you should set up tRPC to use [superjson data transformer](https://trpc.io/docs/data-transformers#using-superjson).

:::

_NOTE_: The ZenStack trpc plugin is based on the awesome work by [Omar Dulaimi](https://github.com/omar-dulaimi/prisma-trpc-generator).
