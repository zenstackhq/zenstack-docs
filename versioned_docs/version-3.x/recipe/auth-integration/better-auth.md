---
sidebar_position: 1
sidebar_label: Better-Auth
---

import PackageInstall from '../../_components/PackageInstall';
import PackageExec from '../../_components/PackageExec';

# Better-Auth Integration

[Better-Auth](https://better-auth.com) is a comprehensive authentication library for TypeScript applications. It supports a wide range of authentication providers and offers a flexible plugin system.

This guide will show you how to integrate better-auth with ZenStack.

## Using ZenStack as better-auth's database provider

ZenStack provides a better-auth database adapter in the `@zenstackhq/better-auth` package. You can use it to configure better-auth to use ZenStack ORM as its database backend.

### Installation

<PackageInstall dependencies={["@zenstackhq/better-auth@next"]} />

### Better-Auth configuration

Add the adapter to your better-auth configuration:

```ts
import { zenstackAdapter } from '@zenstackhq/better-auth';

// ZenStack ORM client
import { db } from './db'; 

const auth = new BetterAuth({
    database: zenstackAdapter(db, {
        provider: 'postgresql',
    }),
    // other better-auth options...
});
```

### Schema generation

With the adapter set up, you can use better-auth CLI to populate its database models into your ZModel schema. Make sure you've installed the CLI:

<PackageInstall devDependencies={["@better-auth/cli"]} />

Then, run the "generate" command to generate the schema:

<PackageExec command="@better-auth/cli generate" />

You should see models like `User`, `Session`, and `Account` added to your `schema.zmodel` file if they don't already exist.

Alternatively, you can refer to [better-auth schema documentation](https://www.better-auth.com/docs/concepts/database#core-schema) to manually add the necessary models.

After the schema is configured, you can then use the regular ZenStack database schema migration workflow to push the schema to your database.

## Integrating better-auth with ZenStack's access control

### Creating user-bound ORM client

ZenStack provides a powerful [access control system](../../orm/access-control/) that allows you to define fine-grained access policies for your data models. Enforcing access control often requires fetching the validated current user's identity, which is authentication system's responsibility.

With better-auth, you can use the `auth.api.getSession()` API to get the current session on the server side. The following code shows an example with Next.js:

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

Then you can pass it to `ZenStackClient`'s `$setAuth()` method to get a user-bound ORM client.

```tsx
// ZenStack ORM client with access policy plugin installed
import { authDb } from './db'; 

const userDb = authDb.$setAuth({ userId });
```

### Organization plugin support

Better-Auth has a powerful plugin system that allows you to add new features that contribute extensions across the entire stack - data model, backend API, and frontend hooks. A good example is the [Organization plugin](https://www.better-auth.com/docs/plugins/organization), which sets the foundation for implementing multi-tenant apps with access control.

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

Then you can use the full `userContext` object to get a user-bound client.

```tsx
const userDb = authDb.$setAuth(userContext);
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

Now you can access the organization information in policy rules:

```tsx
model Todo {
  ...
  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String?       @default(auth().organizationId)

  // deny access that don't belong to the user's active organization
  @@deny('all', auth().organizationId != organizationId)
  
  // full access to: list owner, org owner, and org admins
  @@allow('all', 
    auth().userId == ownerId ||
    auth().organizationRole == 'owner' ||
    auth().organizationRole == 'admin')
}
```

## FAQ

- Why do I get the error "Error: non exhaustive match" when running "zen generate"?

  `@better-auth/cli` has a dependency conflict with ZenStack CLI that causes problems when you use "bun" as package manager. To work around, add the following override to your package.json:

  ```json title="package.json"
  {
    "overrides": {
        "chevrotain": "^11"
    }
  }
  ```

  Then nuke "node_modules" and re-install dependencies.

## Sample project

Here is a fully working multi-tenant sample project using better-auth, ZenStack v3, and Next.js:

[https://github.com/ymc9/better-auth-zenstack-multitenancy/tree/zenstack-v3](https://github.com/ymc9/better-auth-zenstack-multitenancy/tree/zenstack-v3)
