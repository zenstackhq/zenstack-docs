---
sidebar_position: 11
description: ZenStack plugins
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Plugin

<ZModelVsPSL>
ZenStack's "plugin" concept replaces PSL's "generator".
</ZModelVsPSL>

Plugin is a powerful mechanism that allows you to extend ZenStack at the schema, CLI, and runtime levels. This section only focuses on how to add plugins to your ZModel. Please refer to the [Plugin Development](../reference/plugin-dev.md) section for more details on how to develop plugins.

## Adding plugins to ZModel

Let's take a look at the following example:

```zmodel
plugin myPlugin {
    provider = 'my-zenstack-plugin'
    output = './generated'
}
```

:::info
In fact, the `zen generate` command is entirely implemented with plugins. The ZModel -> TypeScript generation is supported by the built-in `@core/typescript` plugin, which can be explicitly declared if you wish:

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
2. A `provider` field that specifies where to load the plugin from. It can be a built-in plugin (like `@core/prisma` here), a local folder, or an npm package.
3. Plugin-specific configuration options, such as `output` in this case.

A plugin can have the following effects to ZModel:

- It can contribute custom attributes that you can use to annotate models and fields.
- It can contribute code generation logic that's executed when you run the `zenstack generate` command.

Plugins can also contribute to the ORM runtime behavior, and we'll leave it to the [ORM](../orm/plugins/) part to explain it in detail.
