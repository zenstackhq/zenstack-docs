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
| output | String | Output directory (relative to the path of ZModel) | No       | node_modules/.zenstack |
| compile | Boolean | If the generated TS code should be compiled to JS | No | true |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | true if `compile` is set to false, otherwise false |

### Example

```zmodel title='/schema.zmodel'
plugin enhancer {
  provider = '@core/enhancer'
  output = 'src/lib/zenstack'
  compile = false
}
```
