---
sidebar_position: 18
description: Introspecting an existing database
---

import ExperimentalFeature from '../_components/ExperimentalFeature';
import PackageExec from '../_components/PackageExec';
import AvailableSince from '../_components/AvailableSince';

# Database Introspection

<AvailableSince version="v3.4.0" />

<ExperimentalFeature name="Database introspection" />

Database introspection loads your database's schema, calculates the difference between it and your current ZModel schema, and then
make necessary updates to the ZModel schema to bring it in sync with the database. This is useful when you have a pre-existing database and want to start using ZenStack with it, or when you need to keep your ZModel schema in sync with changes made directly to the database.

> This feature is initially contributed by [@svetch](https://github.com/svetch).

Use the `zen db pull` CLI command to run introspection. Refer to the [CLI reference](../reference/cli.md#db-pull) for more details and options.

:::info
The "db pull" command is NOT based on Prisma's introspection engine and has its own implementation.
:::

## Common Workflows

### Starting a new ZenStack project from an existing database

If you already have a database and want to adopt ZenStack:

1. Initialize a ZenStack project:
    <PackageExec command="zen init" />
2. Configure the `datasource` block in your ZModel schema with the correct database connection URL.
3. Run introspection to generate the schema:
     <PackageExec command="zen db pull" />
4. Review and refine the generated ZModel schema (e.g., add access control rules, computed fields, etc.).
5. Run code generation:
     <PackageExec command="zen generate" />

### Syncing after direct database changes

If changes were made directly to the database (outside of the ZenStack migration workflow), you can re-introspect to update your schema:

1. Run introspection:
   ```bash
   zen db pull
   ```
2. Review the ZModel schema changes and make necessary adjustments

:::warning
Running `zen db pull` may overwrite an existing schema file. Make sure to use source control or manually back up your schema file before running the command.
:::
