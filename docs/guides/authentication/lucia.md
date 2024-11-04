---
description: Integrating with Lucia.
sidebar_position: 5
sidebar_label: Lucia
---

# Integrating With Lucia (Deprecated)

:::info
Lucia's is [not in active development anymore](https://github.com/lucia-auth/lucia/discussions/1714).
:::

[Lucia](https://lucia-auth.com/) is an auth library for your server that abstracts away the complexity of handling sessions. It is a good choice if you need to add custom logic to the auth flow or use email and password authentication.  

To get access policies to work, ZenStack needs to be connected to the authentication system to get the user's identity. This guide introduces tasks required for integrating ZenStack with Lucia Auth. You can find a complete example [here](https://github.com/zenstackhq/sample-luciaAuth-nextjs). 

## Data model requirement

Lucia needs to store your users and sessions in the database. So, your ZModel definition needs to include these two models. Here is the sample schema:

```zmodel title='/schema.zmodel'
model User {
  id       String    @id @default(uuid())
  userName String    @unique
  password String    @omit
  sessions Session[]

  @@allow('read', true)
  @@allow('all', auth() == this)
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime

  user      User     @relation(references: [id], fields: [userId], onDelete: Cascade)
}
```

The data field names and types in the `session` model must exactly match the ones in the above. While you can change the model names, the relation name in the session model (`Session.user`) must be the camel-case version of the user model name. For example, if the user model was named `AuthUser`, the relation must be named `Session.authUser`.

## Prisma adapter

Lucia connects to your database via an adapter, which provides a set of basic, standardized querying methods that Lucia can use.

Lucia has its own Prisma adapter `@lucia-auth/adapter-prisma`. Since ZenStack is based on Prisma, you can use PrismaAdapter for the job:

```tsx title='/lib/auth.ts'
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.user);
```

## Validate requests

Create `validateRequest()`. This will check for the session cookie, validate it, and set a new cookie if necessary. Make sure to catch errors when setting cookies and wrap the function with `cache()` to prevent unnecessary database calls.  To learn more, see Lucia’s  [Validating requests](https://lucia-auth.com/guides/validate-session-cookies/nextjs-app) page.

```tsx title='/lib/auth.ts'
export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {}
    return result;
  }
);
```

This function can be used in server components and form actions to get the current session and user.

```tsx title='/app/page.tsx'
const { user } = await validateRequest();

if (!user) {
  return redirect("/login");
}
```

## Create an enhanced Prisma client

You can create an enhanced Prisma client which automatically validates access policies, field validation rules etc., during CRUD operations. For more details, please refer to [ZModel Language](https://zenstack.dev/docs/reference/zmodel-language) reference.

To create such a client,  simply call the `validateRequest` function to get the current user id and then call the `enhance` API to pass the user identity.

```tsx title='/lib/db.ts'
import { PrismaClient } from '@prisma/client';
import { validateRequest } from './auth';
import { enhance } from '@zenstackhq/runtime';

export const prisma = new PrismaClient();

export async function getEnhancedPrisma(): Promise<PrismaClient> {
  const { user } = await validateRequest();
  // create a wrapper of Prisma client that enforces access policy,
  // data validation, and @password, @omit behaviors
  return enhance(prisma, { user: {id: user?.id!}});
}
```

## Expose more user data

By default, Lucia will not expose any database columns to the `User` type. To add a `userName` field to it, use the `getUserAttributes()` option.

```tsx title='/lib/auth.ts'
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  userName: string;
}

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      userName: attributes.userName
    };
  }
});
```

Then, you can directly access it from the result returned by `validateRequest` function:

```tsx title='/app/page.tsx'
export default async function Page() {
  const { user } = await validateRequest();	
  return (
    <>
      <h1>Hi, {user.userName}!</h1>
      <p>Your user ID is {user.id}.</p>
    </>
  );
}
```
