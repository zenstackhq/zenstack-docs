---
sidebar_position: 1
sidebar_label: "@core/typescript"
description: Generating TypeScript code from ZModel
---

# @core/typescript

The `@core/typescript` plugin generates TypeScript code from ZModel. The generated code is used to access the schema at runtime, as well as type declarations at development time.

**Note:** This plugin runs automatically when you execute `zenstack generate`, even if not explicitly declared in your schema. You only need to declare it if you want to customize its options.

## Options

- `output`
  
  Optional string. Specifies the output directory for the generated TypeScript code. If a relative path is provided, it will be resolved relative to the ZModel schema. Defaults to the same directory as the ZModel schema.

- `lite`
  
  Optional boolean. If set to `true`, the plugin will generate a lite version of schema file "schema-lite.ts" with attributes removed, along side with the full schema. The lite schema is suited to be used in frontend code like with the `@zenstackhq/tanstack-query` library. Defaults to `false`.

- `liteOnly`
  
  Optional boolean. If set to `true`, the plugin will only generate the lite version of schema file "schema-lite.ts" with attributes removed, and skip generating the full schema. The lite schema is suited to be used in frontend code like with the `@zenstackhq/tanstack-query` library. Defaults to `false`.

- `importWithFileExtension`
  
  Optional string. Used to control the `import` statements in the generated code. If set to a string value like ".js", the generated code will import from local modules with the specified file extension. This option is useful in ESM projects with certain TypeScript `moduleResolution` mode.

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
