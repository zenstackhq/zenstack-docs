---
sidebar_label: 4. Access Policy
---

# Access Policy

### Introduction

Among ZenStack's enhancements to Prisma, access policy is the most important one. It is also the central pillar that supports all the other features in the upper layers.

The features that ZenStack's access policy provides include:

- Row-level and field-level access control
- Accessing current user in rules
- Accessing relations in rules
- Pre and post-update rules
- Functions that help you write advanced rules

:::info Secure By Default

When using an enhanced Prisma Client, the first thing that may surprise you is that you can't read or write any data. For example, given the following model:

```zmodel
model User {
    id Int @id
    email String @unique
}
```

The following code will result in a runtime error:

```ts
const prisma = new PrismaClient();
const db = enhance(prisma);
await db.user.create({ data: { email: 'zen@stack.dev'} });
```

The reason is that, with an enhanced client, all CRUD operations are denied by default. You'll need to allow them with policy rules explicitly. This "secure by default" design may cause some inconvenience, but it prevents you from accidentally exposing data to unauthorized users.

:::

### How Access Policies Change Prisma Client's Behavior

Enforcing access policies causes an enhanced Prisma Client to behave differently from the original:

- Read operations can return fewer rows than with a raw Prisma Client.
- Write operations can fail with an error if policies are violated. See [Error Handling](/docs/reference/error-handling) for more details.

---

Following this part of the guide, you'll build an in-depth understanding of how access policy works in ZenStack and how to use it to secure your data.
