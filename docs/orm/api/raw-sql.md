---
sidebar_position: 12
description: Raw SQL API
---

# Raw SQL

Although the [Query API](./index.md) covers most use cases and the [Query Builder API](../query-builder.md) provides a type-safe escape hatch for complex queries, sometimes the most direct approach is to write raw SQL. ZenStack provides four methods on the ORM client for this purpose.

:::danger Access Control
Raw SQL queries bypass ZenStack's [access control](../access-control/) enforcement. If you have the [policy plugin](../../reference/plugins/policy.md) installed, raw SQL methods are rejected by default. You must opt in with `dangerouslyAllowRawSql: true` to use them.
:::

## `$queryRaw`

Executes a raw SQL query and returns the result rows. Uses a tagged template literal for safe parameterization — values are automatically escaped to prevent SQL injection.

```ts
const users = await db.$queryRaw<{ id: number; email: string }[]>`
  SELECT id, email FROM "User" WHERE role = ${role}
`;
```

## `$queryRawUnsafe`

Same as `$queryRaw` but accepts a plain string instead of a template literal.

:::danger SQL Injection Risks
This method is susceptible to SQL injection if you interpolate unsanitized user input directly into the query string.
:::

```ts
// query all users
const users = await db.$queryRawUnsafe<{ id: number; email: string }[]>(
  'SELECT id, email FROM "User"'
);

// query users of a specific role, use parameterized query to avoid SQL injection
const filteredUsers = await db.$queryRawUnsafe<{ id: number; email: string }[]>(
  'SELECT id, email FROM "User" WHERE role = $1', role
);
```

## `$executeRaw`

Executes a raw SQL statement (e.g. `UPDATE`, `DELETE`, `INSERT`) and returns the number of affected rows. Uses a tagged template literal for safe parameterization.

```ts
const count = await db.$executeRaw`
  UPDATE "User" SET name = ${newName} WHERE id = ${userId}
`;
console.log(`${count} row(s) affected`);
```

## `$executeRawUnsafe`

Same as `$executeRaw` but accepts a plain string. The caller is responsible for SQL injection safety.

:::danger SQL Injection Risks
This method is susceptible to SQL injection if you interpolate unsanitized user input directly into the query string.
:::

```ts
const count = await db.$executeRawUnsafe(
  'UPDATE "User" SET name = $1 WHERE id = $2',
  newName,
  userId
);
console.log(`${count} row(s) affected`);
```
