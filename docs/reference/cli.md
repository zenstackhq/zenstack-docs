---
description: CLI references
sidebar_position: 2
sidebar_label: CLI
---

# ZenStack CLI Reference

## Usage

```
zenstack [options] [command]

ζ ZenStack is a Prisma power pack for building full-stack apps.

Documentation: https://zenstack.dev.

Options:
  -v --version           display CLI version
  -h, --help             display help for command

Commands:
  init [options] [path]  Initialize an existing project for ZenStack.
  generate [options]     Generates RESTful API and Typescript client for your data model.
  help [command]         display help for command
```

## Sub Commands

### init

Initializes an existing project to use ZenStack.

```bash
zenstack init [options] [path]
```

#### Arguments

| Name | Description  | Default        |
| ---- | ------------ | -------------- |
| path | Project path | current folder |

#### Options

| Name                  | Description                                      | Default                                   |
| --------------------- | ------------------------------------------------ | ----------------------------------------- |
| --prisma              | location of Prisma schema file to bootstrap from | &lt;project path&gt;/prisma/schema.prisma |
| -p, --package-manager | package manager to use: "npm", "yarn", or "pnpm" | auto detect                               |

#### Examples

Initialize current folder with default settings.

```bash
npx zenstack init
```

Initialize "myapp" folder with custom package manager and schema location.

```bash
npx zenstack init -p pnpm --prisma prisma/my.schema myapp
```

### generate

Generates RESTful CRUD API and React hooks from your model.

```bash
zenstack generate [options]
```

#### Options

| Name                  | Description                                      | Default         |
| --------------------- | ------------------------------------------------ | --------------- |
| --schema              | schema file (with extension .zmodel)             | ./schema.zmodel |
| -p, --package-manager | package manager to use: "npm", "yarn", or "pnpm" | auto detect     |

#### Examples

Generate with default settings.

```bash
npx zenstack generate
```

Generate with custom package manager and schema location.

```bash
npx zenstack generate -p pnpm --schema src/my.zmodel
```
