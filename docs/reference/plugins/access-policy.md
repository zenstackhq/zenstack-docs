---
description: Built-in plugin for generating access policy guards
sidebar_position: 3
---

# @core/access-policy

The `@core/access-policy` plugin generates access policy guard objects from [policy rules](/docs/guides/understanding-access-policy) (defined using `@@allow` and `@@deny` attributes).

:::info
This plugin is always automatically included when `zenstack generate` is run. You only need to add it to your ZModel if you want to customize its options.
:::

## Options

| Name   | Type   | Description      | Required | Default                    |
| ------ | ------ | ---------------- | -------- | -------------------------- |
| output | String | Output directory (relative to the path of ZModel) | No       | node_modules/.zenstack |
| compile | Boolean | If the generated TS code should be compiled to JS | No | true |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | true if `compile` is set to false, otherwise false |

## Example

```zmodel title='/schema.zmodel'
plugin zod {
  provider = '@core/access-policy'
  output = 'src/lib/zenstack'
  compile = false
}
```

Runtime APIs like [`enhance`](/docs/reference/runtime-api#enhance) and [`withPolicy`](/docs/reference/runtime-api#withpolicy) depend on the output of this plugin and by default load it from the default output location. If you customize the output location, you need to load and pass it manually:

```ts
const policy = require('./lib/zenstack/policy').default;
const db = enhance(prisma, { user }, policy);
```
