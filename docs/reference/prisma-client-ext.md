---
description: APIs ZenStack adds to the PrismaClient
sidebar_position: 4
sidebar_label: Added PrismaClient APIs
---

# Added PrismaClient APIs

ZenStack's enhancement to PrismaClient not only alters its existing APIs' behavior, but also adds new APIs.

### check

#### Scope

This API is added to each model in the PrismaClient.

:::warning
The API is not supported on edge runtime (e.g., Cloudflare Workers or Vercel Edge). You'll get a runtime error when calling it.
:::

#### Description

Checks if the current user is allowed to perform the specified operation on the model based on the access policies in ZModel. The check is done via pure logical inference and doesn't query the database.

Please refer to [Checking Permissions Without Hitting the Database](../guides/check-permission) for more details.

:::danger

Permission checking is an approximation and can be over-permissive. You MUST NOT trust it and circumvent the real access control mechanism (e.g., calling raw Prisma CRUD operations without further authorization checks).

:::

#### Signature

```ts
type CheckArgs = {
  /**
   * The operation to check for
   */
  operation: 'create' | 'read' | 'update' | 'delete';

  /**
   * The optional additional constraints to impose on the model fields
   */
  where?: { ... };
}

check(args: CheckArgs): Promise<boolean>;
```

#### Example

```ts
const db = enhance(prisma, { user: getCurrentUser() });

// check if the current user can read published posts
await canRead = await db.post.check({
  operation: 'read',
  where: { published: true }
});
```
