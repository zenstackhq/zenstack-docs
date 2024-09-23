---
description: Built-in plugin for generating Zod schemas for validating CRUD input arguments
sidebar_position: 4
---

# @core/zod

The `@core/zod` plugin generates [Zod](https://github.com/colinhacks/zod) schemas for models and input arguments of Prisma CRUD operations. The plugin is automatically enabled when any of the following conditions meets:
- If any model carries [field validation attributes](../zmodel-language#data-validation).
- If any plugin that depends on it is used, e.g., the [tRPC plugin](./trpc).

:::info
You need to explicitly enable `@core/zod` plugin if you use the [Express.js](../server-adapters/express) or [Fastify](../server-adapters/fastify) server adapter with `zodSchemas` option enabled.
:::

By default, the Zod schemas are generated into `node_modules/.zenstack/zod` directory, and are reexported through `@zenstackhq/runtime/zod`. If you configure the plugin to output to a custom location, you can just directly import from there.

The generated schemas have the following three parts:

- `zod/models`
    
    The schemas for validating the models and input data for creating and updating the models. They contain field's typing and [validation rules](../zmodel-language#data-validation). The module exports several Zod schemas for each model for different use cases. To facilitate the discussion, let's use the following model as an example:

    ```zmodel
    model Post {
      id Int @id @default(autoincrement())
      title String @length(10, 255)
      published Boolean @default(false)
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
      author User @relation(fields: [authorId], references: [id])
      authorId Int

      @@validate(regex(title, "^[A-Za-z0-9 ]+$"))
    }
    ```
    
    - *[Model]Schema*

        The schema for validating the model itself, including all scalar fields, foreign key fields, and relation fields. All relation fields are optional.

        ```ts
        const PostSchema = z.object({
          id: z.number(),
          title: z.string().min(10).max(255),
          published: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
          author: z.record(z.unknown()).optional(),
          authorId: z.number(),
        });
        ```

    - *[Model]CreateScalarSchema*

        The schema for validating the input for creating the model. It only includes scalar fields. All fields are required unless it's optional in the model or has a default value.

        ```ts
        const PostCreateScalarSchema = z.object({
          id: z.number().optional(),
          title: z.string().min(10).max(255),
          published: z.boolean().optional(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        });
        ```

    - *[Model]CreateSchema*
  
        The schema for validating the input for creating the model. It's similar to `[Model]CreateScalarSchema` but includes foreign key fields. You can use it to validate create input that involves setting foreign keys.

        ```ts
        const PostCreateSchema = z.object({
          id: z.number().optional(),
          title: z.string().min(10).max(255),
          published: z.boolean().optional(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          authorId: z.number(),
        });
        ```

    - *[Model]UpdateScalarSchema*
    
        The schema for validating the input for updating the model. It only includes scalar fields. All fields are optional (since in Prisma's semantic, all updates are patching).

        ```ts
        const PostUpdateScalarSchema = z.object({
          id: z.number(),
          title: z.string().min(10).max(255),
          published: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }).partial();
        ```

    - *[Model]UpdateSchema*
    
        Similar to `[Model]UpdateScalarSchema` but includes foreign key fields (all optional). You can use it to validate update input that involves setting foreign keys.

        ```ts
        const PostUpdateSchema = z.object({
          id: z.number(),
          title: z.string().min(10).max(255),
          published: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
          authorId: z.number(),
        }).partial();
        ```

    - *[Model]???WithoutRefinementSchema*
  
        This includes `[Model]WithoutRefinementSchema`, `[Model]CreateWithoutRefinementSchema`, and `[Model]UpdateWithoutRefinementSchema`. These are only generated when a model contains `@@validate` model-level data validation rules.

        The `@@validate` rules are translated into `z.refine()` calls. For example, for the `Post` model, the following refinement function is generated:

        ```ts
        function refinePost<T, D extends z.ZodTypeDef>(schema: z.ZodType<T, D, T>) {
          return schema.refine((value: any) => new RegExp('^[A-Za-z0-9 ]+$').test(value?.title));
        }
        ```

        However, zod has a limitation that, when you call `.refine()` on a `ZodObject` schema, the result won't be an object schema anymore, which means that you can't use `.omit()`, `.partial()`, etc. `ZodObject` methods to further tune it for your needs anymore. That's why a series of `WithoutRefinementSchema` schemas are exported. They are the Zod schemas prior to calling the `refine()` method. If you need to make changes to the schema while still preserving the `@@validate` rules, you can manipulate the `WithoutRefinementSchema` schemas and then call the `refine` function manually on the result. E.g.:

        ```ts
        const myPostCreateSchema = refinePost(PostCreateWithoutRefinementSchema.omit({id: true}));
        ```

    - *[Model]PrismaCreateSchema*
  
        Used internally by ZenStack.

    - *[Model]PrismaUpdateSchema*
  
        Used internally by ZenStack.

- `zod/input`

    The schema for validating the input arguments of Prisma CRUD operations. You usually won't use them directly. The [tRPC plugin](./trpc) relies on them to validate the input arguments in the generated routers.

- `zod/objects`

    The schema for objects and enums used by the `zod/input` schemas. You usually won't use them directly.

### Installation

This plugin is built-in to ZenStack and does not need to be installed separately.

### Options

| Name   | Type   | Description      | Required | Default                    |
| ------ | ------ | ---------------- | -------- | -------------------------- |
| output | String | Output directory (relative to the path of ZModel) | No       | node_modules/.zenstack/zod |
| modelOnly | Boolean | Only generate schemas for the models, but not for the Prisma CRUD input arguments | No | false |
| generateModels | String, String[] | Array or comma separated string for the models to generate routers for. | No      | All models |
| compile | Boolean | If the generated TS code should be compiled to JS | No | true |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | true if `compile` is set to false, otherwise false |
| noUncheckedInput | Boolean | Disables schema generation for Prisma's ["Unchecked"](https://github.com/prisma/prisma/discussions/10121#discussioncomment-1621254) input types | No | false |
| mode | String | Controls if the generated schemas should reject, strict, or passthrough unknown fields. Possible values: "strict", "strip", "passthrough" | No | "strict" |

:::info
When the `generateModels` option is used to specify a list of models to generate, the plugin will also recursively traverse and include all models that are referenced by the specified models. This can result in more code being generated than you expect.
:::

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
