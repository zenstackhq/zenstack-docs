---
description: Built-in plugin for generating Prisma schema
sidebar_position: 1
---

# @core/prisma

The `@core/prisma` plugin generates a Prisma schema from ZModel.

:::info
This plugin is always automatically included when `zenstack generate` is run. You only need to add it to your ZModel if you want to customize its options.
:::

### Installation

This plugin is built-in to ZenStack and does not need to be installed separately.

### Options

| Name           | Type    | Description                                       | Required | Default                |
| -------------- | ------- | ------------------------------------------------- | -------- | ---------------------- |
| output         | String  | Output file path (relative to the path of ZModel)                                  | No       | ./prisma/schema.prisma |
| generateClient | Boolean | Whether to run `prisma generate` after generation | No       | true                   |
| generateArgs | String | Command line arguments appended to the `prisma generate` call, e.g., "--no-engine". Please note that the "--schema" option is automatically passed, and you shouldn't provide it explicitly. | No       |                    |
| format         | Boolean | Whether to run `prisma format` after generation   | No       | true                  |

### Example

```zmodel title='/schema.zmodel'
plugin prisma {
    provider = '@core/prisma'
    output = './src/prisma/schema.prisma'
}
```
