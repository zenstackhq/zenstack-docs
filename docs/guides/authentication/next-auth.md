---
description: Integrating with NextAuth.
sidebar_position: 1
sidebar_label: NextAuth
---

# Integrating With NextAuth

[NextAuth](https://next-auth.js.org/) is a comprehensive framework for implementating authentication in Next.js projects. It offers a pluggable mechanism for configuring how user data is persisted.

To get access polocies to work, ZenStack needs to be connected to the authentication system for getting user's identity. This guides introduces tasks required for integrating ZenStack with NextAuth. You can find a full example [here](https://github.com/zenstackhq/zenstack/tree/main/samples/todo ':target=blank').

### Data model requirement

NextAuth is agnostic about the type of underlying database, but it requires certain table structures, depending on how you configure it. Your ZModel definitions should reflect these requirements. A sample `User` model is shown here (to be used with `CredentialsProvider`):

```prisma title='/schema.zmodel'
model User {
    id String @id @default(cuid())
    email String @unique @email
    emailVerified DateTime?
    password String @password @omit
    name String?
    image String? @url

    // open to signup
    @@allow('create', true)

    // full access by oneself
    @@allow('all', auth() == this)
}
```

You can find the detailed database model requirements [here](https://next-auth.js.org/adapters/models ':target=blank').

### Adapter

Adapter is a NextAuth mechanism for hooking in custom persistence of auth related entities, like User, Account, etc. Since ZenStack is based on Prisma, you can simply use PrismaAdapter for the job:

```ts {6} title='/src/pages/api/auth/[...nextauth].ts'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
    // install Prisma adapter
    adapter: PrismaAdapter(prisma),
    ...
};

export default NextAuth(authOptions);
```

### Authorize users for credentials-based auth

If you use [`CredentialsProvider`](https://next-auth.js.org/providers/credentials ':target=blank'), i.e. email/password based auth, you need to implement a `authorize` function for verifying credentials against the database.

This is standard Prisma stuff, and the following is just a quick example on how to do it;

```ts title='/src/pages/api/auth/[...nextauth].ts'
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
    ...
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: 'Email Address',
                    type: 'email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },

            authorize: authorize(prisma),
        }),
    ]
};

function authorize(prisma: PrismaClient) {
  return async (credentials: Record<"email" | "password", string> | undefined) => {
    if (!credentials) throw new Error("Missing credentials");
    if (!credentials.email) throw new Error('"email" is required in credentials');
    if (!credentials.password) throw new Error('"password" is required in credentials');

    const maybeUser = await prisma.user.findFirst({
      where: { email: credentials.email },
      select: { id: true, email: true, password: true },
    });

    if (!maybeUser || !maybeUser.password) return null;

    const isValid = await compare(credentials.password, maybeUser.password);
    if (!isValid) {
      return null;
    }

    return { id: maybeUser.id, email: maybeUser.email };
  };
}
```

### Create an enhanced Prisma client

You can create an enhanced Prisma client which automatically validates access policies, field validation rules etc., during CRUD operations. For more details, please refer to [Writing Access Policies](/docs/guides/access-policy) and [Writing Field Validation Rules](/docs/guides/field-validation).

To create such an enhanced client with standard setup, call the `withPresets` API with a standard Prisma client and the current user (fetched with NextAuth API). Here's an example:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { withPresets } from '@zenstackhq/runtime';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { prisma } from '../../../server/db/client';

async function getPrisma(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    // create a wrapper of Prisma client that enforces access policy,
    // data validation, and @password, @omit behaviors
    return withPresets(prisma, { user: session?.user });
}
```

:::tip

Although the name `unstable_getServerSession` looks suspicious, it's officially recommended by NextAuth and is production-ready.

:::

You can then use this enhanced Prisma client for CRUD operations that you desire to be governed by the access policies you defined in your data models.
