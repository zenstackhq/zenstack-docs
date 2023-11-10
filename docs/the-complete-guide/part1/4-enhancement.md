---
sidebar_label: 4. Enhanced Prisma Client
---

# Enhanced Prisma Client

Here we are, the most exciting part of ZenStack.

In the previous chapters, we've been focusing on the design-time concepts: the ZModel language and the `zenstack` CLI. Now, let's get to ZenStack's power at runtime. You'll understand why we say ZenStack ⚡️supercharges⚡️ Prisma.

### What Is Enhanced Prisma Client?

An enhanced Prisma Client is a transparent proxy that wraps a regular Prisma Client instance. It has the same API as the original Prisma Client but adds additional behaviors by intercepting API calls. The added behaviors include:

- Enforcing access policies
- Data validation
- Hashing passwords
- Omitting fields from query results

More will come in the future.

Creating an enhanced Prisma Client is easy, just call the `enhance` API with a regular Prisma Client:

```ts
import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';

const prisma = new PrismaClient();
const db = enhance(prisma);

// db has the same typing as prisma
await db.user.findMany();
await db.user.create({ data: { email: 'zen@stack.dev'} });
```

In a real-world application, you'll usually call `enhance` with an extra context argument to provide the current user identity, so that the access policy engine knows which user is making the call.

```ts
import { getSessionUser } from './auth';

// the `getSessionUser` implementation depends on your authentication solution
const db = enhance(prisma, { user: getSessionUser() });
```

We'll get to that in detail in the next chapter.

A few extra notes about enhanced Prisma Client:

- **Creating an enhanced client is cheap**
  
  It doesn't cause new database connections to be made. It's common to create a new enhanced Prisma Client per request.

- **Using Prisma Client Extensions with enhanced client**
  
  Enhanced Prisma Client is a transparent proxy, so it has the same API as the original Prisma Client. You can enhance a Prisma Client with Client Extensions installed or install Client Extensions on an enhanced Prisma Client - both work.

- **Using the original client and an enhanced one together**
  
  You can use both in your application. For example, you may want to use an enhanced client in part of the logic where you want access policy enforcement, while using the original client where you need unrestricted access to the database.

:::warning Limitations

We try to make the enhanced Prisma Client as compatible as possible with the original Prisma Client, but there are still some limitations:

1. No Sequential Operations Transaction

  Enhanced Prisma CLient doesn't support [sequential operations transaction](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#sequential-prisma-client-operations). Use [interactive transaction](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions) instead, or simply use the original Prisma Client.

1. Raw SQL APIs Are Not Enhanced

  Although you can call raw sql APIs like `$queryRaw` or `$executeRaw`, these APIs are not enhanced, so their behavior is the same as the original Prisma Client. It means that, for example, if you use `@omit` to mark a field to be dropped on return:

  ```zmodel
  model User {
      ...
      password String @omit
  }
  ```

  If you query via `$queryRaw`, the `password` field will still be returned.

You should fall back to using the original Prisma Client in such cases.
:::

### Using Enhanced Prisma Client In REPL

We saw in the previous chapter that in the REPL environment, you can use the built-in `prisma` variable to access Prisma Client directly. Another variable named `db` gives you access to an enhanced Prisma Client.

Let's try it out:

```bash
npx zenstack repl
```

```js
db.user.findMany();
```

```js
[]
```

It works but gives an empty array. Why? With an enhanced Prisma Client, all operations are denied by default unless you explicitly open them up with access policies. Let's see how to do that in the next chapter.

### Inner Workings

:::info
This part is for those interested in the inner workings of ZenStack. It's not necessary to understand it to use ZenStack.
:::

If you know the inner workings of Prisma Client, you'll find ZenStack shares some similarities.. When `zenstack generate` is run, besides generating the `prisma/schema.prisma` file, it also runs several other plugins that transform different pieces of information in the ZModel into Javascript code that can be efficiently loaded and executed at runtime. The `enhance` API relies on the generated code to get its job done.

- `model-meta.js`

    Light-weighted representation of ZModel's AST.

- `policy.js`
  
    Partial Prisma query input objects compiled from access policy expressions.

- `zod/**/*.js|ts`

    Zod schemas for validating input data according to ZModel.

The generation by default outputs to the `node_modules/.zenstack` folder. You can pass a `--output, -o` CLI switch when running `zenstack generate` to use a custom output location.

```bash
npx zenstack generate -o lib/zenstack
```

The `enhance` API, by default, loads the generated code from the `node_modules/.zenstack` folder. If you use a custom output location, make sure to use the `loadPath` option to specify it.

```ts
const db = enhance(prisma, { user: getSessionUser() }, { loadPath: 'lib/zenstack' });
```

---

This chapter gave an abstract overview of the enhanced Prisma Client. In the following chapters, you'll see how each kind of enhancement helps simplify your development work.

Let's roll on.
