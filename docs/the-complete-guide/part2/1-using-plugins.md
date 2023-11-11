---
sidebar_label: 1. Using Plugins
---

# Using Plugins

To use a plugin, install the plugin npm package:

```bash
npm install --save-dev @zenstackhq/openapi
```

:::info

Many plugins are design-time only, and you should install them as dev dependencies. However, some plugins are also used at runtime and need to be installed as regular dependencies. Refer to the plugin's documentation for details.

:::

Then add a plugin declaration in your ZModel:

```zmodel title="schema.zmodel"
plugin openapi {
    provider = "@zenstackhq/openapi"
    output = "openapi.yaml"
    title = "My Todo API"
    version = "1.0.0"
}
```

A plugin declaration requires a mandatory `provider` field that specifies the package name of the plugin (which the `zenstack` CLI imports directly with `require()`). It can also contain other mandatory and optional fields specific to the plugin.

When you run `zenstack generate`, the plugin will be executed and generate the output files.
