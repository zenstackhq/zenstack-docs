---
sidebar_position: 12
---

# Plugin

Plugins allow you to extend the ZModel language and add custom code generation logic.

## Syntax

```zmodel
plugin PLUGIN_NAME {
    provider = PROVIDER
    OPTION*
}
```

-   **PLUGIN_NAME**

    Name of the plugin. Needs to be unique in the entire model. Must be a valid identifier.

-   **`provider`**
  
    The JavaScript module that provides the plugin's implementation. It can be a built-in plugin (like `@core/typescript`), a local JavaScript file, or an installed NPM package that exports a plugin.

-   **OPTION**

    A plugin configuration option, in form of "NAME = VALUE". Option values can be literal, array, or object. 

## Example

```zmodel
plugin custom {
    provider = './my-plugin.js'
    output = './generated'
}
```