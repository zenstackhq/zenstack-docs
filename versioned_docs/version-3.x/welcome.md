---
description: Welcome to ZenStack
slug: /welcome
sidebar_label: Welcome
sidebar_position: 1
---

# Welcome

Welcome to ZenStack - the modern data layer for your TypeScript application!

ZenStack is built with the belief that most applications should use the data model as its center pillar. If that model is well-designed, it can serve as the single source of truth throughout the app's lifecycle, and be used to derive many other aspects of the app. The result is a smaller, more cohesive code base that scales well as your team grows while maintaining a high level of developer experience.

Inside the package you'll find:

- **Intuitive schema language**
  
  That helps you model data, relation, access control, and more, in one place. [🔗](./modeling/)

- **Powerful ORM**
  
  With awesomely-typed API, built-in access control, and unmatched flexibility. [🔗](./orm/)

- **Query-as-a-Service**
  
  That provides a full-fledged data API without the need to code it up. [🔗](./service/)

- **Utilities**
  
  For deriving artifacts like Zod schemas, frontend hooks, OpenAPI specs, etc., from the schema. [🔗](./category/utilities)

> *ZenStack originated as an extension to Prisma ORM. V3 is a complete rewrite that removed Prisma as a runtime dependency and replaced it with an implementation built from the scratch ("scratch" = [Kysely](https://kysely.dev/) 😆). On its surface, it continues to use a "Prisma-superset" schema language and a query API compatible with PrismaClient.*