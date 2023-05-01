---
description: Built-in plugin for generating Zod schemas for validating CRUD input arguments
sidebar_position: 4
---

# @core/zod

The `@core/zod` plugin generates [Zod](https://github.com/colinhacks/zod) schemas for input arguments of Prisma CRUD operations.

:::info
You need to enable `@core/zod` plugin if you use the [Express.js](/docs/reference/server-adapters/express) or [Fastify](/docs/reference/server-adapters/fastify) server adapter with `zodSchemas` option enabled.
:::

## Options

| Name   | Type   | Description      | Required | Default                    |
| ------ | ------ | ---------------- | -------- | -------------------------- |
| output | String | Output directory | No       | node_modules/.zenstack/zod |
| compile | Boolean | If the generated TS code should be compiled to JS | No | true |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | true if `compile` is set to false, otherwise false |

## Example

```prisma title='/schema.zmodel'
plugin zod {
  provider = '@core/zod'
}
```

You can turn off the `compile` option and use a custom `output` location if you want the generated Zod schema to be compiled along with your own Typescript project:

```prisma title='/schema.zmodel'
plugin zod {
  provider = '@core/zod'
  output = 'src/lib/zod'
  compile = false
}
```
