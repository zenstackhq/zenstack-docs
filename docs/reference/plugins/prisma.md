---
description: Built-in plugin for generating Prisma schema
sidebar_position: 1
---

# @core/prisma

The `@core/prisma` plugin generates a Prisma schema from ZModel. This plugin is always automatically included when `zenstack generate` is run. You only need to add it to your ZModel if you want to customize its options.

## Options

| Name           | Type    | Description                                       | Required | Default                |
| -------------- | ------- | ------------------------------------------------- | -------- | ---------------------- |
| output         | String  | Output file path                                  | No       | ./prisma/schema.prisma |
| generateClient | Boolean | Whether to run `prisma generate` after generation | No       | true                   |

## Example

```prisma title='/schema.zmodel'
plugin prisma {
    provider = '@core/prisma'
    output = './src/prisma/schema.prisma'
    generateClient = false
}
```
