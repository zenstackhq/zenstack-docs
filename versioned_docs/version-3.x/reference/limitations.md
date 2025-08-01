---
description: Current limitations
sidebar_position: 100
---

# Limitations

This section lists the current limitations of ZenStack.

### Sequential operations transaction

[Sequential operations transaction](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#sequential-prisma-client-operations) is not supported by enhanced Prisma clients yet.

As a workaround, use [interactive transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions) instead.

### Minimum transaction isolation level

To ensure access policies are properly enforced, the database's transaction isolation level should be set to at least [Repeatable Read](https://en.wikipedia.org/wiki/Isolation_(database_systems)#Repeatable_reads). This can be done by changing the settings of the database, or providing the `isolationLevel` option when creating `PrismaClient`:

```ts
const prisma = new PrismaClient({
  transactionOptions: {
    isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
  },
});
```

If you don't want to change the global settings, alternatively you can set the `transactionIsolationLevel` option when calling ZenStack's `enhance` API. All the transactions initiated internally by ZenStack will use the specified isolation level.

```ts
const db = enhance(prisma, { user }, { transactionIsolationLevel: 'RepeatableRead' });
```

### MongoDB is not supported

Right now, the focus of this project is SQL databases, and there's no plan to support MongoDB in the near future.

### Cloudflare D1 database is not supported

Prisma doesn't support interactive transactions with D1 databases. ZenStack relies on the feature to enforce access policies in certain cases.
