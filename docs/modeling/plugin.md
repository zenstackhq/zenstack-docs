---
sidebar_position: 12
description: ZenStack plugins
---

import ZModelVsPSL from '../_components/ZModelVsPSL';
import PreviewFeature from '../_components/PreviewFeature.tsx'

# Plugin

<PreviewFeature name="Plugin feature" />

<ZModelVsPSL>
ZenStack's "plugin" concept replaces PSL's "generator".
</ZModelVsPSL>

Plugin is a powerful mechanism that allows you to extend ZenStack at the schema, CLI, and runtime levels. This section only focuses on how to add plugins to your ZModel. Please refer to the [Plugin Development](../recipe/plugin-dev.md) guide for more details on how to develop plugins.

## Adding plugins to ZModel

Let's take a look at the following example:

```zmodel
plugin myPlugin {
    provider = 'my-zenstack-plugin'
    output = './generated'
}
```

:::info
In fact, the `zen generate` command is entirely implemented with plugins. The ZModel -> TypeScript generation is supported by the built-in `@core/typescript` plugin which runs automatically. You can explicitly declare it if you wish:

```zmodel
plugin typescript {
    provider = '@core/typescript'
    output = '../generated'
}
```

Please refer to the [Plugin References](../category/plugins) for the full list of built-in plugins.
:::

A plugin declaration involves three parts:

1. A unique name
2. A `provider` field that specifies where to load the plugin from. It can be a built-in plugin (like `@core/prisma` here), a local JS/TS module, or an NPM package name.
3. Plugin-specific configuration options, such as `output` in this case. Options are solely interpreted by the plugin implementation.

A plugin can have the following effects to ZModel:

- It can contribute custom attributes and functions that you can use to annotate models and fields.
- It can contribute code generation logic that's executed when you run the `zen generate` command.

:::info
Plugins can also extend ZenStack's CLI and ORM runtime behavior. Please refer to the [Plugin Development](../recipe/plugin-dev.md) documentation for a comprehensive guide.
:::
