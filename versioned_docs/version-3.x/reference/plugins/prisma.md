---
sidebar_position: 2
sidebar_label: "@core/prisma"
---

# @core/prisma

The `@core/prisma` plugin generates a Prisma schema file from ZModel.

Please note that ZenStack's ORM runtime doesn't depend on Prisma, so you don't need to use this plugin to use the ORM. However, you can use it to generate a Prisma schema and then run custom Prisma generators or other tools that consumes a Prisma schema.

## Options

- `output`: Specifies the path of the generated Prisma schema file. If a relative path is provided, it will be resolved relative to the ZModel schema.

## Example

```zmodel
plugin prisma {
  provider = '@core/prisma'
  output = '../prisma/schema.prisma'
}
```
