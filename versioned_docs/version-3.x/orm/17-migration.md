---
description: Database schema migrations
---

# Database Migration

Database schema migration is a crucial aspect of application development. It helps you keep your database schema in sync with your data model and ensures deployments are smooth and predictable. ZenStack provides migration tools that create migration scripts based on the ZModel schema and apply them to the database.

## Introduction

ZenStack migration is built on top of [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate). The `zen` CLI provides a set of migration-related commands that are simple wrappers around Prisma CLI. When running these commands, the CLI automatically generates a Prisma schema from ZModel and then executes the corresponding Prisma CLI.

Basing on Prisma Migrate brings the following benefits:

- **No reinventing the wheel**: Prisma Migrate is a mature and widely used migration tool, ensuring reliability and stability.

- **Backward compatibility**: When migrating from Prisma to ZenStack, you can continue using your existing migration scripts without any changes.

If you are already familiar with Prisma Migrate, you can continue using your current workflow with ZenStack, simply swapping the `prisma` CLI with `zen`. If not, this section will guide you through the commands and common workflows, but it's strongly recommended to check [Prisma Migrate documentation](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/overview) for in-depth information.

## Commands

Please refer to the [CLI Reference](../reference/cli.md) for the complete list of commands and options.

### db push

The `zen db push` command is used to push your ZModel schema changes to the database without creating a migration file. It's useful for development and testing purposes, but should never be used in production.

### migrate dev

The `zen migrate dev` command is used to create a new migration file based on your ZModel schema changes. It will also apply the migration to your database. The command is for development only and should never be used in production.

### migrate deploy

The `zen migrate deploy` command is used to apply all pending migrations to your production database. It's typically used in your deployment pipeline.

### migrate reset

The `zen migrate reset` command is used to reset your database to a clean state by dropping all tables and reapplying all migrations. It's useful for testing and development purposes, but should never be used in production.

### migrate status

The `zen migrate status` command is used to check the status of your migrations. It will show you which migrations have been applied and which are pending.

### migrate resolve

The `zen migrate resolve` command is used to mark a migration as applied or rolled back without changing the database schema. This is useful for situations where you need to manually intervene in the migration process.

## Workflow

### Typical development workflow

1. Make changes to your ZModel schema.
2. Run `zen db push` to push the changes to your database without creating a migration file.
3. Test the changes locally.
4. Run `zen migrate dev` to create a migration file. You'll be promoted if a full reset is needed.
5. Carefully review the migration file, make changes as needed, and commit it to source control.

### Typical deployment workflow

The most common practice is to run `zen migrate deploy` as part of your production deployment pipeline, which simply applies all pending migrations to the database.
