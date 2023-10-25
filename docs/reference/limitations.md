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

### Edge runtime is not supported

Prisma by default doesn't support running in edge runtime environments (e.g. [Vercel Edge Runtime]https://edge-runtime.vercel.app/). Its [Accelerate](https://www.prisma.io/data-platform/accelerate) commercial service does support edge, but ZenStack is not compatible with it yet. We plan to support it in the near future.
