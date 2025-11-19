---
sidebar_position: 1
description: Quick start guide
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import ZModelStarter from '../_components/_zmodel-starter.md';
import PackageInstall from '../_components/PackageInstall';
import PackageExec from '../_components/PackageExec';
import PackageDlx from '../_components/PackageDlx';

# Quick Start

:::info
All v3 packages are currently published under the "@next" tag.
:::

There are several ways to start using ZenStack ORM.

## 1. Creating a project from scratch

Run the following command to scaffold a new project with a pre-configured minimal starter:

```bash
npm create zenstack@next my-project
```

Or simply use the [interactive playground](https://stackblitz.com/~/github.com/zenstackhq/v3-doc-quick-start) to experience it inside the browser.

## 2. Adding to an existing project

To add ZenStack to an existing project, run the CLI `init` command to install dependencies and create a sample schema:

<PackageDlx package="@zenstackhq/cli@next" script="zen" args="init" />

Then create a `zenstack/schema.zmodel` file in the root of your project. You can use the following sample schema to get started:

<ZModelStarter />

Finally, run `zen generate` to compile the schema into TypeScript. Optionally, run `zen db push` to push the schema to the database.

<PackageExec command="zen generate" />

## 3. Manual setup

You can also always configure a project manually with the following steps:

1. Install dependencies

  <PackageInstall devDependencies={['@zenstackhq/cli@next']} dependencies={['@zenstackhq/orm@next']} />

2. Create a `zenstack/schema.zmodel` file

  You can use the following sample schema to get started:

  <ZModelStarter />

3. Run the CLI `generate` command to compile the schema into TypeScript

  <PackageExec command="zen generate" />

:::info

By default, ZenStack CLI loads the schema from `zenstack/schema.zmodel`. You can change this by passing the `--schema` option. TypeScript files are by default generated to the same directory as the schema file. You can change this by passing the `--output` option.

You can choose to either commit the generated TypeScript files to your source control, or add them to `.gitignore` and generate them on the fly in your CI/CD pipeline.

:::