---
description: Steps for migrating from existing Prisma projects.
sidebar_position: 4
---

# Migrating Existing Prisma Projects

ZenStack CLI provides an `init` command for easily converting an existing Prisma project.

```bash
npx zenstack@latest init
```

The command does the following things:

1. It copies over `prisma/schema.prisma` to `/schema.zmodel`.

    If your Prisma schema is in a non-standard location, you can pass it in with the `--prisma` option.

    ```bash
    npx zenstack@latest init --prisma prisma/my.schema
    ```

1. It installs NPM packages.

    `zenstack` package as a dev dependency and `@zenstackhq/runtime` as a regular dependency. The CLI tries to guess the package manager you use, but you can also explicitly specify one with the `--package-manager` option (supported values are `npm | pnpm | yarn`).

    ```bash
    npx zenstack@latest init --package-manager pnpm
    ```

If the `init` command doesn't suit your needs, manually doing these steps is just fine. See [ZenStack CLI](../reference/cli) for more details about using the CLI.

## Prisma generators' triple slash hack

One major limitation of Prisma schema is the lack of support for custom attributes and functions. Generators can't directly attach specific metadata to models. The community has been using the triple-slash comment hack as a workaround.

Here's an example from [TypeGraphQL Prisma](https://prisma.typegraphql.com/). The comment on the "password" field marks it to be omitted from both the GraphQL input and output types. The generator parses its text and acts accordingly.

```zmodel title='schema.prisma'
model User {
  id Int @default(autoincrement()) @id
  email String  @unique
  /// @TypeGraphQL.omit(output: true, input: true)
  password String
  posts Post[]
}
```

To make this scenario continue working, ZenStack preserves all triple-slash comments when generating the Prisma schema.

The hack works but is error-prone because comments have no protection from the compiler. Fortunately, with ZModel, you can implement it in a much nicer way, thanks to its custom attributes support:

```zmodel title='schema.zmodel'

attribute @TypeGraphQL.omit(output: Boolean?, input: Boolean?)

model User {
  id Int @default(autoincrement()) @id
  email String  @unique
  password String @TypeGraphQL.omit(output: true, input: true)
  posts Post[]
}
```

Now, if you make a typo or pass in wrongly-typed expressions to the attribute, the compiler catches it for you. When ZenStack generates the Prisma schema, it translates all custom attributes back to triple-slash comments, so the original Prisma generators can continue working as before.
