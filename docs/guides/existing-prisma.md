---
description: Steps for migrating from existing Prisma projects.
sidebar_position: 7
---

# Migrating Existing Prisma Projects

ZenStack CLI provides an `init` command for easily converting an existing Prisma project.

```bash
npx zenstack init
```

The commands does the following things:

1. It copies over `prisma/schema.prisma` to `/schema.zmodel`.

    If your Prisma schema is in a non-standard location, you can pass it in with the `--prisma` option.

    ```bash
    npx zenstack init --prisma prisma/my.schema
    ```

1. It installs NPM packages.

    `zenstack` package as a dev dependency and `@zenstackhq/runtime` as regular dependency. The CLI tries to guess the package manager you use, but you can also explicitly specify one with the `--package-manager` option (supported values are `npm | pnpm | yarn`).

    ```bash
    npx zenstack init --package-manager pnpm
    ```

If the `init` command doesn't suit your needs, doing these steps manually is just fine.
