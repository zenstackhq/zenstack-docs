---
sidebar_position: 1
sidebar_label: "@core/typescript"
description: Generating TypeScript code from ZModel
---

# @core/typescript

The `@core/typescript` plugin generates TypeScript code from ZModel. The generated code is used to access the schema at runtime, as well as type declarations at development time.

## Options

- `output`: Specifies the output directory for the generated TypeScript code. If a relative path is provided, it will be resolved relative to the ZModel schema.

## Output

The plugin generates the following TypeScript files:

- `schema.ts`: TypeScript object representation of the ZModel schema.
- `models.ts`: Exports types for all models, types, and enums defined in the schema.
- `input.ts`: Exports types that you can use to type the arguments passed to the ORM query API, such as `findMany`, `create`, etc.

## Example

```zmodel
plugin ts {
  provider = '@core/typescript'
  output = '../generated'
}
```
