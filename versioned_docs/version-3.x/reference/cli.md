---
description: CLI references
sidebar_position: 2
sidebar_label: CLI
---

# ZenStack CLI Reference

## Usage

```
zenstack [options] [command]

ζ ZenStack is the data layer for modern TypeScript apps.

Documentation: https://zenstack.dev.

Options:
  -v --version        display CLI version
  -h, --help          display help for command

Commands:
  generate [options]  Run code generation.
  migrate             Run database schema migration related tasks.
  db                  Manage your database schema during development.
  info [path]         Get information of installed ZenStack packages.
  init [path]         Initialize an existing project for ZenStack.
  check [options]     Check a ZModel schema for syntax or semantic errors.
  help [command]      display help for command
```

## Sub Commands

### generate

Run code generation plugins.

```bash
Usage: zenstack generate [options]

Run code generation plugins.

Options:
  --schema <file>      schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                       specified in package.json.
  -o, --output <path>  default output directory for code generation
  -h, --help           display help for command
```

### migrate

Run database schema migration related tasks.

```bash
Usage: zenstack migrate [options] [command]

Run database schema migration related tasks.

Options:
  -h, --help         display help for command

Commands:
  dev [options]      Create a migration from changes in schema and apply it to the database.
  reset [options]    Reset your database and apply all migrations, all data will be lost.
  deploy [options]   Deploy your pending migrations to your production/staging database.
  status [options]   Check the status of your database migrations.
  resolve [options]  Resolve issues with database migrations in deployment databases
  help [command]     display help for command
```

#### migrate dev

Create a migration from changes in schema and apply it to the database.

:::warning
For development only. Do not use this command in production.
:::

```bash
Usage: zenstack migrate dev [options]

Create a migration from changes in schema and apply it to the database.

Options:
  --schema <file>      schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                       specified in package.json.
  -n, --name <name>    migration name
  --create-only        only create migration, do not apply
  --migrations <path>  path that contains the "migrations" directory
  -h, --help           display help for command
```

#### migrate reset

Reset your database and apply all migrations, all data will be lost.

:::danger
Never run this command in production. It will drop all data in the database.
:::

```bash
Usage: zenstack migrate reset [options]

Reset your database and apply all migrations, all data will be lost.

Options:
  --schema <file>      schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                       specified in package.json.
  --force              skip the confirmation prompt
  --migrations <path>  path that contains the "migrations" directory
  -h, --help           display help for command
```

#### migrate deploy

Deploy your pending migrations to your production/staging database.

```bash
Usage: zenstack migrate deploy [options]

Deploy your pending migrations to your production/staging database.

Options:
  --schema <file>      schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                       specified in package.json.
  --migrations <path>  path that contains the "migrations" directory
  -h, --help           display help for command
```

#### migrate status

Check the status of your database migrations.

```bash
Usage: zenstack migrate status [options]

Check the status of your database migrations.

Options:
  --schema <file>      schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                       specified in package.json.
  --migrations <path>  path that contains the "migrations" directory
  -h, --help           display help for command
```

#### migrate resolve

Resolve issues with database migrations in deployment databases.

```bash
Usage: zenstack migrate resolve [options]

Resolve issues with database migrations in deployment databases.

Options:
  --schema <file>            schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                             specified in package.json.
  --migrations <path>        path that contains the "migrations" directory
  --applied <migration>      record a specific migration as applied
  --rolled-back <migration>  record a specific migration as rolled back
  -h, --help                 display help for command
```

### db

Manage your database schema during development.

```bash
Usage: zenstack db [options] [command]

Manage your database schema during development.

Options:
  -h, --help      display help for command

Commands:
  push [options]  Push the state from your schema to your database
  help [command]  display help for command
```

#### db push

Push the state from your schema to your database.

```bash
Usage: zenstack db push [options]

Push the state from your schema to your database.

Options:
  --schema <file>     schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel"
                      unless specified in package.json.
  --accept-data-loss  ignore data loss warnings
  --force-reset       force a reset of the database before push
  -h, --help          display help for command
```

### info

Get information of installed ZenStack packages.

```bash
Usage: zenstack info [options] [path]

Get information of installed ZenStack.

Arguments:
  path        project path (default: ".")

Options:
  -h, --help  display help for command
```

### init

Initialize an existing project for ZenStack.

```bash
Usage: zenstack init [options] [path]

Initialize an existing project for ZenStack.

Arguments:
  path        project path (default: ".")

Options:
  -h, --help  display help for command
```

### check

Check a ZModel schema for syntax or semantic errors.

```bash
Usage: zenstack check [options]

Check a ZModel schema for syntax or semantic errors.

Options:
  --schema <file>  schema file (with extension .zmodel). Defaults to "zenstack/schema.zmodel" unless
                   specified in package.json.
  -h, --help       display help for command
```

## Overriding Default Options

### Default Schema Location

You can override the default path that the CLI loads the schema by adding the following key to your `package.json`:

```json
{
  "zenstack": {
    "schema": "path/to/your/schema.zmodel"
  }
}
```

### Default Output Directory

You can override the default code generation output path that the CLI uses by adding the following key to your `package.json`:

```json
{
  "zenstack": {
    "output": "path/to/your/output/directory"
  }
}
```
