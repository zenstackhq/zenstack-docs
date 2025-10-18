# Querying with Access Control

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

After defining access control policies in ZModel, it's time to enjoy their benefits.

## Installing Runtime Plugin

Similar to the schema side, access control's runtime aspect is encapsulated in the `@zenstackhq/plugin-policy` package too, as a Runtime Plugin (more about this topic [later](../plugins/index.md)). You should install it onto the raw ORM client to get a new client instance with access control enforcement.

```ts
import { ZenStackClient } from '@zenstackhq/runtime';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';

// create an unprotected, "raw" ORM client
const db = new ZenStackClient(...);

// install the policy plugin
const authDb = db.$use(new PolicyPlugin());

// make queries with `authDb` to have access control enforced
...
```

## Setting Auth User

As mentioned in the previous part, you can use the `auth()` function in policy rules to refer to the current authenticated user. At runtime, you should use the `$setAuth()` API to provide such information. ZenStack itself is not an authentication library, so you need to determine how to achieve it based on your authentication mechanism.

In a web application, the typical pattern is to inspect the incoming request, extract the user information from it and validate, and then call `$setAuth()` to get an ORM client bound to that user.

```ts
import { getSessionUser } from './auth'; // your auth helper
import { authDb } from './db'; // the client with policy plugin installed

async function handleRequest(req: Request) {
    const user = await getSessionUser(req);

    // create an user-bound client
    const userDb = authDb.$setAuth(user);

    // make queries with `userDb` to make user-bound queries
    ...
}
```

Without calling `$setAuth()`, the client works in anonymous mode, meaning that `auth()` in ZModel is evaluated to null. You can explicitly call `$setAuth(undefined)` to get an anonymous-bound client from a client that's previously bound to a user.

Use the `$auth` property to get the user info previously set by `$setAuth()`.

## Making Queries

Access control policies are effective to both the ORM API and the query-builder API. To understand its behavior, the simplest mental model is to think that rows not satisfying the policies "don't exist".

### ORM Queries

For the most part, the ORM queries behavior is very intuitive.

Read operations like `findMany`, `findUnique`, `count`, etc., only return/involve rows that meet the "read" policies.

Mutation operations that affect multiple rows like `updateMany` and `deleteMany` only impact rows that meet the "update" or "delete" policies respectively.

Mutation operations that affect a single, unique row like `update` and `delete` will throw an `NotFoundError` if the target row doesn't meet the "update" or "delete" policies respectively.

:::info
Why `NotFoundError` instead of `RejectedByPolicyError`? Remember the rationale is rows that don't satisfy the policies "don't exist".
:::

There are some complications when "read" and "write" policies affect the same query. It's ubiquitous because most mutation APIs involve reading the post-mutation entity to return to the caller. When the mutation succeeds but the post-mutation entity cannot be read, a `RejectedByPolicyError` is thrown, even though the mutation is persisted.

```ts
// if Post#1 is updatable but the post-update read is not allowed, the 
// update will be persisted first and then a `RejectedByPolicyError` 
// will be thrown
await db.post.update({
    where: { id: 1 },
    data: { published: false },
});
```

:::info
Why throwing an error instead of returning `null`? Because it'll compromise type-safety. The `create`, `update`, and `delete` APIs don't have a nullable return type.
:::

### Query-Builder Queries

The low-level Kysely-query-builder API is also subject to access control enforcement. Its behavior is intuitive:

- Calling `$qb.selectFrom()` returns readable rows only.
- When you call `$qb.insertInto()`, `RejectedByPolicyError` will be thrown if the inserted row doesn't satisfy the "create" policies. Similar for `update` and `delete`.
- Calling `$qb.update()` and `$qb.delete()` only affects rows that satisfy the "update" and "delete" policies respectively.
- When you join tables, the joined table will be filtered to readable rows only.
- When you use sub-queries, the sub-query will be filtered to readable rows only.

## Limitations

Here are some **IMPORTANT LIMITATIONS** about access control enforcement:

1. Mutations caused by cascade deletes/updates and database triggers are completely internal to the database, so ZenStack cannot enforce access control on them.
2. Raw SQL queries executed via `$executeRaw()` and `$queryRaw()` are not subject to access control enforcement.
3. Similarly, raw queries made with query-builder API using the `sql` tag are not subject to access control enforcement.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-policy" codeFiles={['zenstack/schema.zmodel', 'main.ts']} />

## Implementation Notes

