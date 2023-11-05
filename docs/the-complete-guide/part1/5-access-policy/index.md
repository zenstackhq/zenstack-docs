---
sidebar_label: 5. Access Policy
---

# Access Policy

Among the enhancements that ZenStack made to Prisma, access policy is the most important one. It is also the main pillar that supports all the other features in upper layers.

The features that ZenStack's access policy provides include:

- Row-level and field-level access control
- Accessing current user in rules
- Accessing relations in rules
- Pre and post update rules
- Functions that help you write advanced rules

:::info Secure By Default

When using an enhanced Prisma Client, the first thing that may strike you surprised is that you can't read or write any data. For example, given the following model:

```zmodel
model User {
    id Int @id
    email String @unique
}
```

The following code will result in an runtime error:

```ts
const prisma = new PrismaClient();
const db = enhance(prisma);
await db.user.create({ data: { email: 'zen@stack.dev'} });
```

The reason is that, with enhanced client, all CRUD operations are denied by default. You'll need to explicitly allow them with policy rules. This "secure by default" design may cause some inconvenience, but it prevents you from accidentally exposing data to unauthorized users.

:::

Following this part of the guide, you'll build an in-depth understanding of how access policy works in ZenStack, and how to use it to secure your data.
