---
description: Integrating with NextAuth.
sidebar_position: 1
sidebar_label: NextAuth
---

# Integrating With NextAuth

[NextAuth](https://next-auth.js.org/) is a comprehensive framework for implementing authentication in Next.js projects. It offers a pluggable mechanism for configuring how user data is persisted.

To get access policies to work, ZenStack needs to be connected to the authentication system to get the user's identity. This guide introduces tasks required for integrating ZenStack with NextAuth. You can find a complete example [here](https://github.com/zenstackhq/sample-todo-nextjs ':target=blank').

### Data model requirement

NextAuth is agnostic about the underlying database type, but it requires specific table structures, depending on how you configure it. Therefore, your ZModel definitions should reflect these requirements. A sample `User` model is shown here (to be used with `CredentialsProvider`):

```zmodel title='/schema.zmodel'
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

Adapter is a NextAuth mechanism for hooking in custom persistence of auth-related entities, like User, Account, etc. Since ZenStack is based on Prisma, you can use PrismaAdapter for the job:

```ts title='/src/pages/api/auth/[...nextauth].ts'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
    // install Prisma adapter
    // highlight-next-line
    adapter: PrismaAdapter(prisma),
    ...
};

export default NextAuth(authOptions);
```

### Authorize users for credentials-based auth

If you use [`CredentialsProvider`](https://next-auth.js.org/providers/credentials ':target=blank'), i.e. email/password based auth, you need to implement an `authorize` function for verifying credentials against the database.

This is standard Prisma stuff, and the following is just a quick example of how to do it:

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

You can create an enhanced Prisma client which automatically validates access policies, field validation rules etc., during CRUD operations. For more details, please refer to [ZModel Language](/docs/reference/zmodel-language) reference.

To create such a client with a standard setup, call the `withPresets` API with a regular Prisma client and the current user (fetched with NextAuth API). Here's an example:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { withPresets } from '@zenstackhq/runtime';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { prisma } from '../../../server/db/client';

async function getPrisma(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    // create a wrapper of Prisma client that enforces access policy,
    // data validation, and @password, @omit behaviors
    return withPresets(prisma, { user: session?.user });
}
```

You can then use this enhanced Prisma client for CRUD operations that you desire to be governed by the access policies you defined in your data models.
