---
sidebar_label: 1. Creating a Full-Stack Project
---

# 🛠️ Creating a Full-Stack Project

To simplify the process of building our full-stack Todo app, we'll recreate the project from scratch using the [create-t3-app](https://create.t3.gg/) scaffolding tool - saving us a lot of time manually integrating different tools and libraries. We'll reuse the ZModel schema we built in Part I.

:::info ZenStack is framework-agnostic

For ease of demonstration, we'll use the [Next.js](https://nextjs.org/) framework for full-stack development. However, ZenStack is framework-agnostic. Most of the content apply to other choices, including full-stack ones like like [Nuxt](https://nuxt.com/) and [SvelteKit](https://kit.svelte.dev/), or SPA + backend frameworks like [Express](https://expressjs.com/), [Fastify](https://fastify.dev/), [NestJS](https://nestjs.com/).

:::

### 1. Creating the Project

Create a new Next.js project using `create-t3-app`:

```bash
npx create-t3-app@latest --tailwind --nextAuth --prisma --appRouter --CI my-todo-app
```

It sets up a project with the following features:

- [Next.js](https://nextjs.org) with app router
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

You can also find the updated version here: [https://github.com/zenstackhq/the-complete-guide-sample/blob/v1-part4-start/schema.zmodel](https://github.com/zenstackhq/the-complete-guide-sample/blob/v1-part4-start/schema.zmodel). Replace the `schema.zmodel` file in your project with it.

Run generation and push the schema to the database:

```bash
npx zenstack generate && npx prisma db push
```

:::tip

If you ran into any trouble creating the project, you can also use the "part4-start" branch of [https://github.com/zenstackhq/the-complete-guide-sample](https://github.com/zenstackhq/the-complete-guide-sample/tree/v1-part4-start) as the starting point and continue from there.

:::

### 3. Implementing Authentication

#### 3.1 NextAuth Session Provider

To use NextAuth, we'll need to install a session provider at the root of our app. First, create a file `src/components/SessionProvider.tsx` with the following content:

```tsx title="src/components/SessionProvider.tsx"
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};
function NextAuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default NextAuthSessionProvider;
```

Then, update the `src/app/layout.tsx` file to use it

```tsx title="src/app/layout.tsx"
import NextAuthSessionProvider from '~/components/SessionProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
```

#### 3.2 Credential-Based Auth

The default project created by `create-t3-app` uses Discord OAuth for authentication. We'll replace it with credential-based authentication for simplicity.

Replace the content of `/src/server/auth.ts` with the following:

```ts title="/src/server/auth.ts"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import NextAuth, { type DefaultSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
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
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: authorize(db),
    }),
  ],
};

function authorize(prisma: PrismaClient) {
  return async (credentials: Record<'email' | 'password', string> | undefined) => {
    if (!credentials?.email) throw new Error('"email" is required in credentials');
    if (!credentials?.password) throw new Error('"password" is required in credentials');

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

export default NextAuth(authOptions);
```

Remove code related to `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` from `/src/env.js`, and update the `.env` file under project root to the following:

```bash title=".env"
DATABASE_URL="file:./db.sqlite"
NEXTAUTH_SECRET="abc123"
NEXTAUTH_URL="http://localhost:3000"
```

:::info
You should use a strong `NEXTAUTH_SECRET` in a real application.
:::


### 4. Mounting the CRUD API

ZenStack uses server adapters to mount CRUD APIs to frameworks, and it has several pre-built adapters for popular frameworks - one of which is Next.js. First, install the server adapter package:

```bash
npm install @zenstackhq/server
```

Then, create a file `src/app/api/model/[...path]/route.ts` with the following content:

```ts title='src/app/api/model/[...path]/route.ts'
import { enhance } from '@zenstackhq/runtime';
import { NextRequestHandler } from '@zenstackhq/server/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';
import { db } from '~/server/db';

async function getPrisma() {
  const session = await getServerSession(authOptions);
  return enhance(db, { user: session?.user });
}

const handler = NextRequestHandler({ getPrisma, useAppDir: true });

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
```

:::info

The crucial part is that we use an enhanced PrismaClient with the server adapter, so all API calls are automatically subject to the access policies defined in the ZModel schema.

:::

In the next chapter, we'll learn how to use a plugin to generate frontend data query hooks that help us consume it.

Finally, make a change to the `next.config.js` file to exclude the `@zenstackhq/runtime` package from the server component bundler:

```js title="next.config.js"
const config = {
  experimental: {
    serverComponentsExternalPackages: ['@zenstackhq/runtime']
  }
};
```

:::info Why is this needed?

Next.js's server component bundler automatically bundles dependencies, but it has some restrictions on the set of Node.js features a package can use. The `@zenstackhq/runtime` package makes [unsupported](https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages) `require()` calls. We'll try to make it compatible in a future release. 

:::

### 5. Compile the Project

Compile the project and see if everything is working correctly:

```bash
npm run build
```
