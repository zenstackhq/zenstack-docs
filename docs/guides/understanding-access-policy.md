---
description: Understanding access policies.
sidebar_position: 3
---

# Understanding Access Policies

Proper authorization is the key to a secure application. ZenStack allows you to define access policies directly inside your data model, so it's easier to keep the policies in sync when your data models evolve.

This document introduces the access policy enforcement behavior regarding different database operations. The general principle is to make the behavior a natural extension of how Prisma behaves today.

:::tip

Access policies are only effective when you call Prisma methods enhanced with [`withPolicy`](/docs/reference/runtime-api#withpolicy) or [`withPresets`](/docs/reference/runtime-api#withpresets).

:::

## General rules

Access policies are expressed with the `@@allow` and `@@deny` model attributes. The attributes take two parameters. The first is the operation: create/read/update/delete. You can use a comma-separated string to pass multiple operations or use 'all' to abbreviate all operations. The second parameter is a boolean expression indicating if the rule should be activated.

```prisma
attribute @@allow(_ operation: String, _ condition: Boolean)

attribute @@deny(_ operation: String, _ condition: Boolean)
```

`@@allow` opens up permissions while `@@deny` turns them off. You can use them multiple times and combine them in a model. Whether an operation is permitted is determined as follows:

1. If any `@@deny` rule evaluates to true, it's denied.
1. If any `@@allow` rule evaluates to true, it's allowed.
1. Otherwise, it's denied.

## Accessing user data

When using `withPresets` or `withPolicy` to wrap a Prisma client for authorization, you pass in a context object containing the data about the current user (verified by authentication). This user
data can be accessed with the special `auth()` function in access policy rules. Note that `auth()` function's return value is typed as the `User` model in your schema, so only fields defined in the `User` model are accessible.

You can access its field to implement RBAC like:

```prisma
model Post {
    // full access for admins
    // "role" field must be defined in the "User" model
    @@allow('all', auth().role == 'Admin')
}
```

, or you can use it to check the user's identity directly.

```prisma
model Post {
    ...
    author User @relation(fields: [authorId], references: [id])
    @@allow('all', author == auth())
}
```

## Operations

### Create

#### Prisma methods

`create`, `createMany`, `upsert`

#### Behavior

"Create" operation is governed by the _**create**_ rules. Since an entity doesn't exist before it's created, the fields used in such rules implicitly refer to the creation result. [Field validation](/docs/reference/zmodel-language#field-validation) is also considered a part of _**create**_ rules.

When a create operation is rejected, a [`PrismaClientKnownRequestError`](https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror) is thrown with code [`P2004`](https://www.prisma.io/docs/reference/api-reference/error-reference#p2004).

"Create" operations can contain nested creates, and if a nested-created model has _**create**_ rules, they're also enforced. The entire "create" happens in a transaction.

### Read

#### Prisma methods

`findUnique`, `findUniqueOrThrow`, `findFirst`, `findFirstOrThrow`, `findMany`

#### Behavior

"Read" operations are filtered by _**read**_ rules. For `findMany`, entities failing policy checks are silently dropped. For `findUnique` and `findFirst`, `null` is returned if the requested entity exists but fails policy checks. For `findUniqueOrThrow` and `findFirstOrThrow`, an error is thrown if the requested entity exists but fails policy checks.

```prisma
model Foo {
    id String @id
    value Int
    @@allow('read', value > 0)
}
```

```ts
// given there's a single Foo { id: "1", value: "0" } in the database

db.foo.findUnique({ where: { id: '1' } }); // => null
db.foo.findUniqueOrThrow({ where: { id: '1' } }); // => throws
db.foo.findFirst(); // => null
db.foo.findFirstOrThrow(); // => throws
db.foo.findMany(); // => []
```

The _**read**_ rules also determine if the result of a mutation - create, update or delete can be read back. Therefore, even if a mutation succeeds (and is persisted), the call can still result in a [`PrismaClientKnownRequestError`](https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror) because the entity being returned doesn't satisfy _**read**_ rules.

```prisma
model Foo {
    id String @id
    value Int
    @@allow('read', value > 0)
}
```

```ts
// an entity is created in the database, but the call eventually throws
const created = await db.foo.create({ data: { value: 0 } });
```

### Update

#### Prisma methods

`update`, `updateMany`, `upsert`

#### Behavior

"Update" operations are governed by the _**update**_ rules. An entity has a "pre-update" and "post-update" state. Fields used in _**update**_ rules implicitly refer to the "pre-update" state, and you can use the `future()` function to refer to the "post-update" state. [Field validation](/docs/reference/zmodel-language#field-validation) is also considered a part of _**update**_ rules.

```prisma
model Post {
    id String @id
    title String @length(1, 100)
    author User @relation(fields: [authorId], references: [id])
    authorId String

    // "author" refers to "pre-update" and "future().author" refers to "post-update"
    @@allow('update', author == auth() && future().author == author)
}
```

For top-level or nested `updateMany`, access policies are used to "trim" the scope of the update (by merging with the "where" clause provided by the user). This can end up with fewer entities being updated than without policies. For unique update, either with a top-level `update` or a nested `update` to "to-one" relation, the update will be rejected if it fails policy checks. When an update operation is rejected, a [`PrismaClientKnownRequestError`](https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror) is thrown with code [`P2004`](https://www.prisma.io/docs/reference/api-reference/error-reference#p2004).

```prisma
model Foo {
    id String @id
    value Int

    @@allow('create,read', true)
    @@allow('update', value > 0)
}
```

```ts
// create a Foo { id: '1', value: 0 }
await db.foo.create({ data: { id: '1', value: 0 } });

// succeeds without updating anything
await db.foo.updateMany({ data: { value: 1 } }); // => { count: 0 }

// throws
await db.foo.update({ where: { id: '1' }, data: { value: 1 } });
```

Update operations can contain nested writes - creates, updates or deletes, and if a nested-written model has corresponding rules, they're also enforced. The entire update happens in a transaction.

```prisma
model User {
    id String @id
    email String
    profile Profile?

    @@allow('all', true)
}

model Profile {
    id String @id
    user User @relation(fields: [userId], references: [id])
    userId String
    age Int

    @@allow('update', future().age > 0)
}
```

```ts
// throws because the nested update of "Profile" fails policy
// neither the "User" nor the "Profile" is updated
await db.user.update({
    where: { id: '1' },
    data: {
        email: 'abc@xyz.com',
        profile: {
            update: {
                age: 0,
            },
        },
    },
});
```

### Delete

#### Prisma methods

`delete`, `deleteMany`

#### Behavior

Delete operations are governed by the _**delete**_ rules. Since an entity doesn't exist after it's deleted, the fields used in such rules implicitly refer to the "pre-delete" state.

For top-level or nested `deleteMany`, access policies are used to "trim" the scope of delete (by merging with the "where" clause provided by the user). This can end up with fewer entities being deleted than without policies. For unique delete, either with top-level `delete` or nested `delete` to "to-one" relation, the deletion will be rejected if it fails policy checks.

### Aggregation

#### Prisma methods

`aggregate`, `groupBy`, `count`

#### Behavior

Aggregation operations are filtered by _**read**_ rules. Entities failing policy checks are silently excluded from the data set used for computing the aggregation result.
