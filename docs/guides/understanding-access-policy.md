---
description: Understanding access policies.
sidebar_position: 3
---

# Understanding Access Policies

Proper authorization is the key of a secure application. ZenStack allows you to define access policies directly inside of your data model, so that when your data models evolve, it's easier to keep the policies in sync.

This document introduces the access policy enforcement behavior regarding to different database operations. The general principle is to make the behavior a natural extension to how Prisma behaves today.

:::tip

Access policies are only effective when you call Prisma methods enhanced with [`withPolicy`](/docs/reference/runtime-api#withpolicy) or [`withPresets`](/docs/reference/runtime-api#withpresets).

:::

### Create

#### Prisma methods

`create`, `createMany`, `upsert`

#### Behavior

Create operations are governed by the _**create**_ rules. Since an entity doesn't exist before it's created, the fields used in such rules implicitly refer to the creation result. [Field validation](/docs/reference/zmodel-language#field-validation) is also considered as a part of _**create**_ rules.

When a create operation is rejected, a [`PrismaClientKnownRequestError`](https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror) is thrown with code [`P2004`](https://www.prisma.io/docs/reference/api-reference/error-reference#p2004).

Create operations can contain nested creates, and if a nested-created model has a _**create**_ rule, it's also enforced. The entire create happens in a transaction.

### Read

#### Prisma methods

`findUnique`, `findUniqueOrThrow`, `findFirst`, `findFirstOrThrow`, `findMany`

#### Behavior

Read operations are filtered by _**read**_ rules. For `findMany`, entities failing policy checks are silently dropped. For `findUnique` and `findFirst`, `null` is returned if the requested entity exists but fails policy checks. For `findUniqueOrThrow` and `findFirstOrThrow`, an error is thrown if the requested entity exists but fails policy checks.

### Update

#### Prisma methods

`update`, `updateMany`, `upsert`

#### Behavior

Update operations are governed by the _**update**_ rules. An entity has a "pre-update" and "post-update" state. Fields used in _**update**_ rules implicitly refer to the "pre-update" state, and you can use the special `future()` function to refer to the "post-update" state. [Field validation](/docs/reference/zmodel-language#field-validation) is also considered as a part of _**update**_ rules.

```prisma
model Post {
    id String @id @default(uuid())
    title String @length(1, 100)
    author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
    authorId String

    // "author" refers to "pre-update" and "future().author" refers to "post-update"
    @@allow('update', author == auth() && future().author == author)
}
```

For top-level or nested `updateMany`, access policies are used to "trim" the scope of update (by merging with the "where" clause provided by the user). This can end up with fewer entities being updated than without policies. For unique update, either with top-level `update` or nested `update` to "to-one" relation, the update will be rejected if it fails policy checks.

When an update operation is rejected, a [`PrismaClientKnownRequestError`](https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror) is thrown with code [`P2004`](https://www.prisma.io/docs/reference/api-reference/error-reference#p2004).

Update operations can contain nested creates, updates or deletes, and if a nested model has a _**update**_, _**create**_ or _**delete**_ rule, it's also enforced. The entire update happens in a transaction.

### Delete

#### Prisma methods

`delete`, `deleteMany`

#### Behavior

Delete operations are governed by the _**delete**_ rules. Since an entity doesn't exist after it's delete, the fields used in such rules implicitly refer to the "pre-delete" state.

For top-level or nested `deleteMany`, access policies are used to "trim" the scope of delete (by merging with the "where" clause provided by the user). This can end up with fewer entities being deleted than without policies. For unique delete, either with top-level `delete` or nested `delete` to "to-one" relation, the deletion will be rejected if it fails policy checks.

### Aggregation

#### Prisma methods

`aggregate`, `groupBy`, `count`

#### Behavior

Aggregation operations are filtered by _**read**_ rules. Entities failing policy checks are silently excluded from the data set used for computing the aggregation result.
