---
description: Checking permissions without hitting the database.
sidebar_position: 13
---

# Checking Permissions Without Hitting the Database (Preview)

## Introduction

ZenStack's access control features provide a protection layer around Prisma's CRUD operations and filter/deny access to the data automatically. However, there are cases where you simply want to check if an operation is permitted without actually executing it. For example, you might want to show or hide a button based on the user's permission.

Of course, you can determine the permission by executing the operation to see if it's allowed (try reading data, or mutating inside a transaction then aborting). But this comes with the cost of increased database load and slower UI rendering.

This guide introduces how to use ZenStack's `check` API to check permissions without accessing the database. The feature is in preview, and feedback is highly appreciated.

## The Challenge and Solution

This section provides background about the "permission checking" problem. Feel free to directly skip to the [Usage](#usage) section if you want to try it out right away.

ZenStack's access policies are by design coupled with the data model, which implies that to check permission precisely, you'll have to evaluate it against the actual data. In reality, what you often need is an approximation, or in other words, a "weak" check. For example, you may want to check if the current user, given his role, can create an entity of a particular model, and if so, show the "create" button. You don't really want to guarantee that the user is allowed to create the entity with any data. What you care about is if he's allowed in some cases.

With this in mind, "checking permission" is equivalent to answering the following question:

> Assuming we can have arbitrary rows of data in the database, can the access policies for the given operation possibly evaluate to `TRUE` for the current user?

The problem then becomes a [Boolean Satisfiability Problem](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem). We can treat model fields as "variables" and use a [SAT Solver](https://en.wikipedia.org/wiki/SAT_solver) to find a solution for those variables that satisfy the access policies. If a solution exists, then the permission is possible.

Let's make the discussion more concrete by looking at an example:

```zmodel
model Post {
    id Int @id @default(autoincrement())
    title String
    author User @relation(fields: [authorId], references: [id])
    authorId Int
    published Boolean @default(false)

    @@allow('read', published || auth().id == authorId || auth().role == 'ADMIN')
}
```

The "read" policy rule can be converted to a boolean formula like:

```
OR:
    var(published)
    `context.user.id` == var(authorId)
    `context.user.role` == 'ADMIN'
```

:::info

- The `context` object is the second argument you pass to the `enhance` API call.
- The `var(NAME)` symbol represents a named variable in a boolean formula.

:::

We can try solving for a solution for different cases:

- Can an anonymous user read posts?
  
  Yes. Solution: `published = true`

- Can `user#1` with "User" role read posts that are not published?
  
  :::info
  The extra constraint imposed is `published == false`.
  :::

  Yes. Solution: `authorId = 1`, `published = false`

- Can `user#1` with "User" role read unpublished posts of `user#2`?
  
  :::info
  The extra constraint imposed is `published == false && authorId == 2`.
  :::

  No. No solution.

- Can `user#1` with "ADMIN" role read unpublished posts of `user#2`?
  
  :::info
  The extra constraint imposed is `published == false && authorId == 2`.
  :::

  Yes. The formula is constant `true` because of `context.user.role == 'ADMIN'`.

## Usage

To use the permission checking feature, first, enable the "generatePermissionChecker" preview flag for the "@core/enhancer" plugin in ZModel.

```zmodel

plugin enhancer {
  provider = '@core/enhancer'
  generatePermissionChecker = true
}

```

Then, rerun `zenstack generate`, and the enhanced PrismaClient will have the extra `check` API on each model.

```ts
const db = enhance(prisma, { user: getCurrentUser() });
await canRead = await db.post.check({ operation: 'read' });
```

The input also has an optional where field for imposing additional constraints on model fields.

```ts
await canRead = await db.post.check({ operation: 'read', where: { published: true }});
```

:::danger

As explained in [the previous section](#the-challenge-and-solution), permission checking is an approximation and can be over-permissive. You MUST NOT trust it and circumvent the real access control mechanism (e.g., calling raw Prisma CRUD operations without further authorization checks).

:::

## Limitations

ZenStack uses the [logic-solver](https://www.npmjs.com/package/logic-solver) package for SAT solving. The solver is lightweighted but only supports boolean and bits (non-negative integer) types. This resulted in the following limitations:

- Only `Boolean`, `Int`, `String`, and enum types are supported.
- Functions (e.g., `startsWith`, `contains`, etc.) are not supported.
- Array fields are not supported.
- Relation fields are not supported.
- Collection predicates are not supported.

You can still use the `check` API even if your access policies use these unsupported features. Boolean components containing unsupported features are ignored during SAT solving by being converted to free variables, which can be assigned either `true` or `false` in a solution.

## Notes About Anonymous Context

Access policy rules often use `auth()` and members of `auth()` (e.g., `auth().role`) in them. When a PrismaClient is enhanced in an anonymous context (calling `enhance` without context user object), neither `auth()` nor its members are unavailable. In such cases, the following evaluation rules apply:

- `auth() == null` evaluates to `true`.
- `auth() != null` evaluates to `false`.
- Any other form of boolean component involving `auth()` or its members evaluates to `false`.
