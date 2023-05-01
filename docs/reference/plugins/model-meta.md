---
description: Built-in plugin for generating light-weighted metadata for introspecting schema at runtime
sidebar_position: 2
---

# @core/model-meta

The `@core/model-meta` plugin generates light-weighted metadata for introspecting schema at runtime.

:::info
This plugin is always automatically included when `zenstack generate` is run. You only need to add it to your ZModel if you want to customize its options.
:::

## Options

| Name   | Type   | Description      | Required | Default                    |
| ------ | ------ | ---------------- | -------- | -------------------------- |
| output | String | Output directory | No       | node_modules/.zenstack |
| compile | Boolean | If the generated TS code should be compiled to JS | No | true |
| preserveTsFiles | Boolean | If the generated TS files should be preserved (after compiled to JS) | No | true if `compile` is set to false, otherwise false |

## Example

```prisma title='/schema.zmodel'
plugin zod {
  provider = '@core/model-meta'
  output = 'src/lib/zenstack'
  compile = false
}
```

Runtime APIs like [`withPresets`](/docs/reference/runtime-api#withpresets) and [`withPolicy`](/docs/reference/runtime-api#withpolicy) depend on the output of this plugin and by default load it from the default output location. If you customize the output location, you need to load and pass it manually:

```ts
const meta = require('./lib/zenstack/model-meta').default;
const db = withPresets(prisma, { user }, undefined, meta);
```
