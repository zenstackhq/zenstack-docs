---
description: Built-in plugin for generating JavaScript modules that support runtime enhancement of Prisma Client.
sidebar_position: 2
---

# @core/enhancer

The `@core/enhancer` plugin generates JavaScript modules that support runtime enhancement of Prisma Client. The generated modules include the following:

- enhance

    The `enhance` API that creates a proxy around a `PrismaClient` instance to extend its behavior. When using the default output location, you can import this API from `@zenstackhq/runtime`.

- model-meta

    Lightweight runtime representation of ZModel's AST.

- policy
  
    Partial Prisma query input objects and input checker functions compiled from access policy expressions.

:::info
This plugin is always automatically included when `zenstack generate` is run. You only need to add it to your ZModel if you want to customize its options.
:::

### Installation

This plugin is built-in to ZenStack and does not need to be installed separately.

### Options

| Name   | Type   | Description      | Required | Default                    |
| ------ | ------ | ---------------- | -------- | -------------------------- |
| output | String | Output directory (relative to the path of ZModel). This option will be deprecated in future releases in favor of the "--output" CLI option of `zenstack generate`. | No       | node_modules/.zenstack |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | false |

### Custom output directory and compilation options

You can use the "--output" option of the `zenstack generate` CLI to specify a custom output location for the generated enhancer code:

```bash
zenstack generate --output src/lib/zenstack
```

If you want to have the code generated as TypeScript (instead of compiled to JavaScript), you can add the "--no-compile" option:

```bash
zenstack generate --no-compile --output src/lib/zenstack
```
