---
description: Built-in plugin for generating Zod schemas for validating CRUD input arguments
sidebar_position: 4
---

# @core/zod

The `@core/zod` plugin generates [Zod](https://github.com/colinhacks/zod) schemas for models and input arguments of Prisma CRUD operations. The plugin is automatically enabled when any of the following conditions meets:
- If any model carries [field validation attributes](/docs/reference/zmodel-language#field-validation).
- If any plugin that depends on it is used, e.g., the [tRPC plugin](/docs/reference/plugins/trpc).

:::info
You need to explicitly enable `@core/zod` plugin if you use the [Express.js](/docs/reference/server-adapters/express) or [Fastify](/docs/reference/server-adapters/fastify) server adapter with `zodSchemas` option enabled.
:::

By default, the Zod schemas are generated into `node_modules/.zenstack/zod` directory, and are reexported through `@zenstackhq/runtime/zod`. If you configure the plugin to output to a custom location, you can just directly import from there.

The generated schemas have the following three parts:

- `zod/models`
    
    The schema for validating the models, containing field's typing and [validation rules](/docs/reference/zmodel-language#field-validation). Relation fields and foreign key fields are ignored. For each model, three schemas are generated respectively:
  
    - *[Model]Schema*

        The schema for validating the model itself. All non-optional fields are required.

    - *[Model]CreateSchema*

        The schema for validating the data for creating the model. Similar to "[Model]Schema" but all fields with default values are marked optional.

    - *[Model]UpdateSchema*
    
        The schema for validating the data for updating the model. Similar to "[Model]Schema" but all fields are marked optional.

- `zod/input`

    The schema for validating the input arguments of Prisma CRUD operations. You usually won't use them directly. The [tRPC plugin](/docs/reference/plugins/trpc) relies on them to validate the input arguments in the generated routers.

- `zod/objects`

    The schema for objects and enums used by the `zod/input` schemas. You usually won't use them directly.

## Options

| Name   | Type   | Description      | Required | Default                    |
| ------ | ------ | ---------------- | -------- | -------------------------- |
| output | String | Output directory (relative to the path of ZModel) | No       | node_modules/.zenstack/zod |
| modelOnly | Boolean | Only generate schemas for the models, but not for the Prisma CRUD input arguments | No | false |
| compile | Boolean | If the generated TS code should be compiled to JS | No | true |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | true if `compile` is set to false, otherwise false |
| noUncheckedInput | Boolean | Disables schema generation for Prisma's ["Unchecked"](https://github.com/prisma/prisma/discussions/10121#discussioncomment-1621254) input types | No | false |

## Example

Declare the plugin in your ZModel file:

```zmodel title='/schema.zmodel'
plugin zod {
  provider = '@core/zod'
}
```

Then you can import and use the generated schemas:

```ts
import { PostCreateSchema } from '@zenstackhq/runtime/zod/models';

PostCreateSchema.parse(data);
```

You can turn off the `compile` option and use a custom `output` location if you want the generated Zod schema to be compiled along with your own Typescript project:

```zmodel title='/schema.zmodel'
plugin zod {
  provider = '@core/zod'
  output = 'src/lib/zod'
  compile = false
}
```
