---
description: Built-in plugin for generating Zod schemas for validating CRUD input arguments
sidebar_position: 2
---

# @core/zod

The `@core/zod` plugin generates [Zod](https://github.com/colinhacks/zod) schemas for input arguments of Prisma CRUD operations.

:::info
You need to enable `@core/zod` plugin if you use the [Express.js](/docs/reference/server-adapters/express) or [Fastify](/docs/reference/server-adapters/fastify) server adapter with `zodSchemas` option enabled.
:::

## Options

| Name   | Type   | Description      | Required |
| ------ | ------ | ---------------- | -------- |
| output | String | Output directory | Yes      |

## Example

```prisma title='/schema.zmodel'
plugin zod {
  provider = '@core/zod'
  output = "./src/lib/zod"
}
```
