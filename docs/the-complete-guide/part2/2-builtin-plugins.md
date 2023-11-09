---
sidebar_label: 2. Built-in Plugins
---

# Built-in Plugins

ZenStack ships with a set of built-in plugins. They fall into the following two categories.

### Core Plugins

Most of the core functionalities of ZenStack are implemented as or supported by a few core plugins. They're vital to the operation of ZenStack and are enabled automatically. Core plugins are implemented inside the `zenstack` npm package and have names starting with `@core/`.

Here's a quick overview of them:

- [@core/prisma](/docs/reference/plugins/prisma)

    Transforms ZModel to Prisma schema and runs `prisma generate` to generate Prisma Client.

- [@core/model-meta](/docs/reference/plugins/model-meta)

    Transforms ZModel to light-weighted Javascript to be used at runtime.

- [@core/access-policy](/docs/reference/plugins/access-policy)

    Transforms access policies into partial Prisma query objects used for injecting Prisma queries at runtime.

- [@core/zod](/docs/reference/plugins/zod)

    Transforms ZModel into [Zod](https://zod.dev/) schemas for validating input data at runtime.

The ZenStack CLI automatically decides whether a core plugin should be enabled based on the ZModel. You can also explicitly declare a core plugin to override its options. For example, declare a `@core/prisma` plugin to output the generated Prisma schema file to a custom location:

```zmodel
plugin prisma {
    provider = "@core/prisma"
    output = "src/db/prisma/schema.prisma"
}
```

### Maintained Plugins

Besides core plugins, the ZenStack team also maintains a set of useful but non-essential plugins. They are implemented in separate npm packages under the `@zenstackhq` organization.

- [@zenstackhq/tanstack-query](/docs/reference/plugins/tanstack-query)

    Generates frontend data query hooks for targeting [Tanstack Query](https://tanstack.com/query). You'll learn more about using ZenStack for full-stack development in [Part III](/docs/the-complete-guide/part3/) and [Part IV](/docs/the-complete-guide/part4/) of this guide.

- [@zenstackhq/swr](/docs/reference/plugins/swr)

    Generates frontend data query hooks for targeting [SWR](https://swr.vercel.app/). You'll learn more about using ZenStack for full-stack development in [Part III](/docs/the-complete-guide/part3/) and [Part IV](/docs/the-complete-guide/part4/) of this guide.

- [@zenstackhq/trpc](/docs/reference/plugins/trpc)

    Generates [tRPC](https://trpc.io/) routers for database queries and mutations.
  
- [@zenstackhq/openapi](/docs/reference/plugins/openapi)

    Generates [OpenAPI](https://www.openapis.org/) specs from the ZModel schema.
