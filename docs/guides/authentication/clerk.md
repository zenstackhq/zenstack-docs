---
description: Integrating with Clerk.
sidebar_position: 2
sidebar_label: Clerk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Integrating With Clerk

[Clerk](https://clerk.com/) is a comprehensive authentication and user management platform, providing both APIs and pre-made UI components.

### Set up Clerk

First, follow Clerk's [quick start guides](https://clerk.com/docs/quickstarts/overview) to set up your project.

### Adjust your ZModel

Since Clerk manages both user authentication and storage, you don't need to store users in your database anymore. However, since the `auth()` function is resolved to the `User` model in ZModel, you still need to define it in your schema. The trick here is to mark the `User` model as ignored so Prisma doesn't map it to a database table.

You can include any field you want in the `User` model, as long as you provide the same set of fields in the context object used for creating the enhanced Prisma client.

The following code shows an example blog post schema:

```zmodel
model User {
    id String @id
    @@ignore
}

model Post {
  id String @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title String
  published Boolean @default(false)
  authorId String // stores Clerk's user ID

  // author has full access
  @@allow('all', auth() != null && auth().id == authorId)

  // logged-in users can view published posts
  @@allow('read', auth() != null && published)
}
```

If you choose to [synchronize user data to your database](https://clerk.com/docs/users/sync-data-to-your-backend), you can model the `User` model as a regular Prisma model without putting the `@@ignore` attribute there.

### Create an enhanced Prisma client

You can create an enhanced Prisma client that automatically validates access policies, field validation rules, etc., during CRUD operations. For more details, please refer to [ZModel Language](../../reference/zmodel-language) reference.

To create such a client with a standard setup, call the `enhance` API with a regular Prisma client and the current user (fetched from Clerk). Here's an example:

<Tabs>

<TabItem value="app-router" label="Next.js App Router">

```ts
import { enhance } from '@zenstackhq/runtime';
import { auth } from "@clerk/nextjs/server";
import { prisma } from '../lib/db';

async function getPrisma() {
  const authObject = auth();
  // create a wrapper of Prisma client that enforces access policy
  return enhance(prisma, {
    user: authObject ? { id: authObject.userId } : undefined,
  });
}
```

</TabItem>

<TabItem value="react" label="Next.js Pages Router">

```ts
import type { NextApiRequest } from 'next';
import { enhance } from '@zenstackhq/runtime';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '../lib/db';

async function getPrisma(req: NextApiRequest) {
  const auth = getAuth(req);
  // create a wrapper of Prisma client that enforces access policy
  return enhance(prisma, { user: auth ? { id: auth.userId } : undefined });
}
```

</TabItem>

</Tabs>

---

You can find a working sample project for Next.js [here](https://github.com/zenstackhq/docs-tutorial-clerk). Use the "main" branch for app router, and the "pages-router" branch for pages router.
