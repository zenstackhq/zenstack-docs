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

### Comparison between fields in access policies

Currently, it's not possible to compare fields in access policies expressions. For example, the following usages are not allowed yet, but will be supported in the future:

```zmodel
model A {
    x Int
    y Int
    @@allow('read', x > y)
}

model B {
    x String
    y String
    @@allow('read', contains(x, y))
}

model C {
    x String
    y String[]
    @@allow('read', x in y)
}
```

