---
sidebar_label: 1. Creating a Full-Stack Project
---

# Creating a Full-Stack Project

To simplify the process of building our full-stack Todo app, we'll recreate the project from scratch using the [create-t3-app](https://create.t3.gg/) scaffolding tool - which saves us a lot of time integrating different tools and libraries manually. We'll reuse the ZModel schema from the previous part.

:::info ZenStack is framework-agnostic

For ease of demonstration, we'll use the [Next.js](https://nextjs.org/) framework for the frontend. However, ZenStack is framework-agnostic. Most parts of the content are applicable to other frameworks, include full-stack frameworks like like [Nuxt](https://nuxt.com/) and [SvelteKit](https://kit.svelte.dev/), or SPA + backend frameworks like [Express](https://expressjs.com/), [Fastify](https://fastify.dev/), [NestJS](https://nestjs.com/).

:::

### 1. Creating the Project

Create a new Next.js project using `create-t3-app`:

```bash
npx create-t3-app@latest --prisma --nextAuth --tailwind --CI my-blog-app
```

It sets up a project with the following features:

- TypeScript
- Prisma for ORM
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- SQLite for database

We'll also use "daisyUI" for UI components. Run the following command to install it:

```bash
npm i -D daisyui@latest
```

Then add the "daisyui" plugin to `tailwind.config.ts`:

```js
module.exports = {
  //...
  plugins: [require("daisyui")],
}
```

Finally, add some utility packages we'll use later:

```bash
npm install nanoid
```

### 2. Setting Up ZenStack

Initialize the project for ZenStack:

```bash
npx zenstack@latest init
```

Besides installing dependencies, the command also copies the `prisma/schema.prisma` file to `schema.zmodel`. We're going to continue using the ZModel we've developed in the previous part, but with a few tweaks:

1. All "id" fields are changed to String type (as required by NextAuth).
2. The "markdown" and "openapi" plugins are removed (not needed for this part).

You can also find the updated version here: [https://github.com/zenstackhq/the-complete-guide-sample/blob/part3/schema.zmodel](https://github.com/zenstackhq/the-complete-guide-sample/blob/part3/schema.zmodel). Replace the `schema.zmodel` file in your project with it.

Run generation and push the schema to the database:

```bash
npx zenstack generate && npx prisma db push
```

### 3. Implementing Credential-Based Authentication

The default project created by `create-t3-app` uses Discord OAuth for authentication. We'll replace it with credential-based authentication for simplicity.

Replace the content of `/src/server/auth.ts` with the following:

```ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import type { GetServerSidePropsContext } from "next";
import NextAuth, {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: authorize(db),
    }),
  ],
};

function authorize(prisma: PrismaClient) {
  return async (
    credentials: Record<"email" | "password", string> | undefined,
  ) => {
    if (!credentials?.email)
      throw new Error('"email" is required in credentials');
    if (!credentials?.password)
      throw new Error('"password" is required in credentials');
    const maybeUser = await prisma.user.findFirst({
      where: { email: credentials.email },
      select: { id: true, email: true, password: true },
    });
    if (!maybeUser?.password) return null;
    // verify the input password with stored hash
    const isValid = await compare(credentials.password, maybeUser.password);
    if (!isValid) return null;
    return { id: maybeUser.id, email: maybeUser.email };
  };
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export default NextAuth(authOptions);
```

Remove code related to `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` from `/src/env.mjs`, and update the `.env` file under project root to the following:

```bash
DATABASE_URL="file:./db.sqlite"
NEXTAUTH_SECRET="abc123"
NEXTAUTH_URL="http://localhost:3000"
```

:::info
You should use a strong `NEXTAUTH_SECRET` in a real application.
:::


### 4. Mounting the CRUD API

ZenStack uses server adapters to mount CRUD APIs to frameworks, and it this several built-in adapters for popular frameworks - one of which is Next.js. First, install the server adapter package:

```bash
npm install @zenstackhq/server
```

Then, create a file `src/pages/api/model/[...path].ts` with the following content:

```ts
import { NextRequestHandler } from '@zenstackhq/server/next';
import { enhance } from '@zenstackhq/runtime';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '../../../server/auth';
import { db } from '../../../server/db';

async function getPrisma(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerAuthSession({ req, res });
    // create a wrapper of Prisma client that enforces access policy,
    // data validation, and @password, @omit behaviors
    return enhance(db, { user: session?.user });
}

export default NextRequestHandler({ getPrisma });
```

:::info

The important part here is that we use an enhanced PrismaClient with the server adapter, so all API calls are automatically subject to the access policies defined in the ZModel schema.

:::

By default, the server adapter uses the RPC flavor of the API. In the next chapter, we'll learn how to use a plugin to generate frontend data query hooks that help up consume it.

### 5. Compile the Project

Compile the project and see if everything is working correctly:

```bash
npm run build
```
