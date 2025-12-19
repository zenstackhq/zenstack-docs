---
description: Integrating with Better Auth
sidebar_position: 2
sidebar_label: Better Auth
---

# Integrating With Better Auth

[Better Auth](https://better-auth.com/) is an emerging open-source TypeScript authentication framework that offers a comprehensive set of features and great extensibility.

## Preparation

Follow Better Auth's installation [guide](https://www.better-auth.com/docs/installation#configure-database) using the Prisma adapter:

```tsx
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
});
```

Running Better Auth CLI to generate the Auth-related model in the Prisma schema:

```bash
npx @better-auth/cli generate
```

## Integrate with ZenStack

Follow the [installation guide](https://zenstack.dev/docs/install) to install ZenStack in your project. 

Integration with ZenStack is all about obtaining the user's identity and utilizing it to create an enhanced `PrismaClient`. On the server side,  Better Auth exposes that through the `api` object of the `auth` instance.  For example, here is how to get that in Next.js:

```tsx
import { betterAuth } from "better-auth";
import { headers } from "next/headers";
 
export const auth = betterAuth({
    //...
})
 
// calling get session on the server
const {session} = await auth.api.getSession({
    headers: await headers() // some endpoint might require headers
});

// get the userId from session data
const userId = session.userId;
```

Then you can pass it to ZenStack's [`enhance()`](https://zenstack.dev/docs/reference/runtime-api#enhance) API to create an enhanced `PrismaClient` that automatically enforces access policies.

```tsx
const db = enhance(prisma, { user: {id: userId} });
```

## Organization Plugin Support

Better Auth has a powerful plugin system that allows you to add new features that contribute extensions across the entire stack - data model, backend API, and frontend hooks. A good example is the [Organization plugin](https://www.better-auth.com/docs/plugins/organization), which sets the foundation for implementing multi-tenant apps with access control.

After enabling the Organization plugin and running the CLI to generate the additional models and fields in the schema, you can use the code below on the server side to get the organization info together with the user identity:

```tsx

  let organizationRole: string | undefined = undefined;
  const organizationId = session.activeOrganizationId;
  const org = await auth.api.getFullOrganization({ headers: reqHeaders });
  if (org?.members) {
    const myMember = org.members.find(
        (m) => m.userId === session.userId
    );
    organizationRole = myMember?.role;
  }
  
  // user identity with organization info
  const userContext = {
    userId: session.userId,
    organizationId,
    organizationRole,
  };
```

:::info
The Better Auth CLI will only update the `schema.prisma` file, if you add the Organization plugin after installing the ZenStack, you need to copy the change to `schema.zmodel` too. 
:::

Then you can pass the full `userContext` object to the `enhanced` client: 

```tsx
const db = enhance(prisma, { user: userContext });
```

The user context will be accessible in ZModel policy rules via the special `auth()` function. To get it to work, let's add a type in ZModel to define the shape of `auth()`:

```tsx
type Auth {
  userId           String  @id
  organizationId   String?
  organizationRole String?
  @@auth
}
```

Here is how you could access it in the access policies:

```tsx
model Todo {
  ...
  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String?       @default(auth().organizationId) @allow('update', false)

  // deny access that don't belong to the user's active organization
  @@deny('all', auth().organizationId != organizationId)
  
  // full access to: list owner, org owner, and org admins
  @@allow('all', 
    auth().userId == ownerId ||
    auth().organizationRole == 'owner' ||
    auth().organizationRole == 'admin')
}
```

You can find a complete sample of a multi-tenant Todo app code [here](https://github.com/ymc9/better-auth-zenstack-multitenancy).