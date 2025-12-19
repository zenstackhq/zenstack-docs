---
sidebar_position: 5
description: Plugin development guide
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import PackageInstall from '../_components/PackageInstall';

# Plugin Development

This guide provides a comprehensive introduction to developing ZenStack plugins, demonstrating how to extend ZenStack’s functionality at the schema, CLI, and runtime levels.

## Extending the schema language

Plugins can contribute new ZModel attributes and functions, and use them to extend the data modeling semantics. To do that, create a folder in your source tree with a `plugin.zmodel` file in it, and define your custom attributes and/or functions in it.

:::tip
You can also package a plugin as an npm package. Make sure to export the "plugin.zmodel" file in the package's `package.json` file.
:::

The following example shows a sample plugin that allows you to mark fields as "password" and specify hashing algorithms to use.

:::info
Custom attributes and functions by themselves don't have any effect. They are commonly combined with other plugin aspects to achieve a meaningful goal, like we'll see in the next sections.
:::

<StackBlitzGithub repoPath="zenstackhq/v3-doc-plugin" openFile="zenstack/password-plugin/plugin.zmodel" />

:::info
Model-level attributes must be prefixed with `@@`, and field-level ones with `@`.
:::

You need to enable the plugin in your ZModel to use the attributes and functions defined in it:

```zmodel title="schema.zmodel"
plugin password {
    provider = './password-plugin'
}

model User {
    id Int @id @default(autoincrement())
    password String @password(hasher: bcryptHasher(10))
}
```

### Parameter and return types

The following types can be used for attribute parameters and function parameters and returns:

- String
- Int
- Float
- Boolean
- DateTime
- Object
- Any

A parameter can be set optional by suffixing its type with a `?`.

## Generating custom artifacts

The `zen` CLI is extensible via plugins and allows you to generate custom artifacts from the ZModel schema. To continue the previous example, let's create a very simple CLI plugin that generates a markdown document listing all model fields marked as passwords.

To implement a plugin, first install the "@zenstackhq/sdk" package that contains type definitions and utilities for working with ZModel AST:

<PackageInstall devDependencies={["@zenstackhq/sdk@next"]} />

A CLI plugin is an ESM module that default-exports an object that contains the following fields:

- `name`: the name of the plugin.
- `generate`: an async function that's invoked during the `zen generate` command run.
- `statusText` (optional): text displayed in the CLI during the plugin run.

The implementation looks like the following:

<StackBlitzGithub repoPath="zenstackhq/v3-doc-plugin" openFile="zenstack/password-plugin/index.ts" />

Then, enable the reporting in ZModel with the "report" option:

```zmodel title="schema.zmodel"
plugin password {
    provider = './password-plugin'
    report = true
}
```

Finally, run the `zen generate` command to generate the report:

```bash
npx zen generate
```

You should see that the custom plugin is run during the generation process, and the markdown file is created in the output folder.

```plain
% npx zen generate
✔ Generating TypeScript schema
✔ Running plugin Password Report
Generation completed successfully in 116ms.
```

:::info How does the CLI load plugin modules?
The CLI attempts to load the plugin module following these steps:
1. If `provider` is resolvable as a file path (with ".js", ".mjs", ".ts", or ".mts" extensions), load it as a local file.
2. If `provider` is resolvable as a folder containing an index file (with ".js", ".mjs", ".ts", or ".mts" extensions), load the index file.
3. Otherwise, load it as an npm package.

Please note that only ESM modules are supported. TypeScript files are loaded via [jiti](https://github.com/unjs/jiti).
:::

## Extending the ORM runtime

The most powerful aspect of the plugin system is the ability to extend the ORM runtime behavior. ZenStack's ORM client provides a plugin system that allows you to intercept the ORM query lifecycle at different stages and abstraction levels. Please see the [ORM plugins](../orm/plugins/) documentation for detailed information.

In this section, we'll see how to implement automatic password hashing functionality at runtime using the [Kysely](https://kysely.dev/) query hooks mechanism. The implementation requires an understanding of Kysely's [Operation Node](https://kysely-org.github.io/kysely-apidoc/interfaces/OperationNode.html) concept (which is the SQL AST used by Kysely internally).

:::warning
The implementation is mostly vibe-coded with Claude Code. Please review carefully before using it in production.
:::

<StackBlitzGithub repoPath="zenstackhq/v3-doc-plugin" openFile="password-hasher-plugin.ts" />

With the plugin installed on the ORM client, any time you create or update a User record, the password field will be automatically hashed before being stored in the database.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-plugin" openFile="main.ts" />
