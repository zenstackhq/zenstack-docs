---
sidebar_position: 9
description: Transaction API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Transaction

You can use the `$transaction` method to run multiple operations in a transaction. There are two overloads of this method:

## Sequential Transaction

This overload takes an array of promises as input. The operations are executed sequentially in the order they are provided. The operations are independent of each other, because there's no way to access the result of a previous operation and use it to influence the later operations.

```ts
// Note that the `db.user.create` and `db.post.create` calls are not awaited. They
// are passed to the `$transaction` method to execute.
const [user, post] = await db.$transaction([
  db.user.create({ data: { name: 'Alice' } }),
  db.user.create({ data: { name: 'Bob' } }),
]);
```

The result of each operation is returned in the same order as the input.

## Interactive Transaction

This overload takes an async callback function as input. The callback receives a transaction client that can be used to perform database operations within the transaction.

Interactive transactions allows you to write imperative code that can access the results of previous operations and use them to influence later operations. Albeit it's flexibility, you should make the transaction callback run as fast as possible so as to reduce the performance impact of the transaction on the database. 

```ts
const [user, post] = await db.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { name: 'Alice' } });
  const post = await tx.post.create({ data: { title: 'Hello World', authorId: user.id } });
  return [user, post];
});
```

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="transaction.ts" startScript="generate,transaction" />
