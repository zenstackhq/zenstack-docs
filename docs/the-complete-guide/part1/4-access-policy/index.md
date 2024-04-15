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

:::info Secure by Default

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
- Write operations can fail with an error if policies are violated. See [Error Handling](../../../reference/error-handling) for more details.

### ZenStack Access Policy vs Postgres Row-Level Security

If you are an experienced Postgres user, or are familiar with products like [Supabase](https://supabase.com/) or [PostgREST](https://postgrest.org/), you may find ZenStack's access policy similar to Postgres' [row-level security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). Conceptually, they're identical: they both let you define access control rules at the schema level and enforce them automatically during data access.

ZenStack's access policy is NOT implemented with Postgres RLS. Here are some key differences between them:

- RLS is implemented at the database engine level, while ZenStack's access policy is at the ORM level.
- Due to the different levels of implementation, RLS is likely more performant, but ZenStack's access policy is more portable (it supports databases other than Postgres).
- RLS is defined in SQL, while ZenStack's access policies are defined in a more intuitive expression language.
- RLS, as its name suggests, is limited to row-level access control. ZenStack's access policy supports both row-level and field-level access control.

---

Following this part of the guide, you'll build an in-depth understanding of how access policy works in ZenStack and how to use it to secure your data.
