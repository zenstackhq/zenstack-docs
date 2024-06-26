---
description: Current limitations
sidebar_position: 100
---

# Limitations

This section lists the current limitations of ZenStack.

### Sequential operations transaction

[Sequential operations transaction](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#sequential-prisma-client-operations) is not supported by enhanced Prisma clients yet.

As a workaround, use [interactive transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions) instead.

### MongoDB is not supported

Right now, the focus of this project is SQL databases, and there's no plan to support MongoDB in the near future.

### Cloudflare D1 database is not supported

Prisma doesn't support interactive transactions with D1 databases. ZenStack relies on the feature to enforce access policies in certain cases.
