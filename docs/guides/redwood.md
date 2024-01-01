---
description: Guide for using ZenStack with RedwoodJS.
sidebar_position: 7
---

# Using With RedwoodJS

[RedwoodJS](https://redwoodjs.com/) is an opinionated full-stack framework that combines a set of awesome technologies and helps you build GraphQL-based applications fast without struggling with tooling.

ZenStack provides a plugin package to help you integrate with RedwoodJS projects with ease. After setting it up, you can define access policies in ZModel and use the enhanced PrismaClient to automatically enforce the policies in your services.

## Details

### Setting up

You can prepare your RedwoodJS project for ZenStack by running the following command at the root of your project:

```bash
yarn rw setup package @zenstackhq/redwood
```

The setup command will:

1. Update "redwood.toml" to allow ZenStack CLI plugin
   
    ```yaml
    [[experimental.cli.plugins]]
    package = "@zenstackhq/redwood"
    enabled = true
    ```

2. Install ZenStack dependencies to the "api" package
   
    - `zenstack`: the main CLI
    - `@zenstackhq/runtime`: the runtime library for creating enhanced PrismaClient
    - `@zenstackhq/redwood`: custom CLI and runtime for RedwoodJS

3. Prepare ZModel schema

    Your prisma schema file "api/db/schema.prisma" will be copied to "api/db/schema.zmodel". Moving forward, you should edit "schema.zmodel" to update database schema and access policies. The "schema.prisma" file will be regenerated when you run `yarn rw @zenstackhq generate`.

4. Register location of "schema.zmodel" and "schema.prisma" in "api/package.json"

    ```json title="api/package.json"
    {
        ...
        "zenstack": {
            "schema": "db/schema.zmodel",
            "prisma": "db/schema.prisma"
        }
    }
    ```
   
5. Install a GraphQLYoga plugin to the GraphQL handler
   
    ```ts title="api/src/functions/graphql.[ts|js]"
    import { useZenStack } from '@zenstackhq/redwood'
    import { db } from 'src/lib/db'
    import { createGraphQLHandler } from '@redwoodjs/graphql-server'
    ...

    export const handler = createGraphQLHandler({
        ...
        extraPlugins: [useZenStack(db)],
    })
    ```

    The `useZenStack` plugin creates an enhanced PrismaClient for the current requesting user and stores it as `db` field in the global GraphQL context. You can access the enhanced PrismaClient in your service code via `context.db`.

    The `useZenStack(db)` call by default uses `context.currentUser` to get the current requesting user. You can customize it by passing in a function as the second argument to calculate a custom user object based on `context.currentUser`. E.g.:

    ```ts
    useZenStack(db, async (currentUser) => {
        const typedUser = currentUser as { id: string };
        const dbUser = await db.user.findUnique({ 
            where: { id: typedUser.id },
            // select more fields
            select: { id: true, role: true }
        });
        return dbUser;
    });
    ```

    See [here](/docs/the-complete-guide/part1/access-policy/current-user) for more details about access the current user.
   
6. Eject service templates

    The setup runs `yarn rw setup generator service` to eject template files used by `yarn rw g service` command. It also modifies the templates to use `context.db` instead of `db` to access database for automatic access policy enforcement.

### Modeling data and access policies

ZenStack's ZModel language is a superset of Prisma schema language. You should use it to define both the data schema and access policies. [The Complete Guide](/docs/the-complete-guide/part1/) of ZenStack is the best way to learn how to author ZModel schemas.

You should run the following command after updating "schema.zmodel":

```bash
yarn rw @zenstackhq generate
```

The command does the following things:

1. Regenerate "schema.prisma"
2. Run `prisma generate` to regenerate PrismaClient
3. Generates supporting JS modules for enforcing access policies at runtime


<!-- You can also use the

```bash
yarn rw @zenstackhq sample
```

command to browse a list of sample schemas and create from them. -->

### Development workflow

The workflow of using ZenStack is very similar to using Prisma in RedwoodJS projects. The two main differences are:

1. Generation

    You should run `yarn rw @zenstackhq generate` in place of `yarn rw prisma generate`. The ZenStack's generate command internally regenerates the Prisma schema from the ZModel schema, runs `prisma generate` automatically, and also generates other modules for supporting access policy enforcement at the runtime.

2. Database access in services

    In your service code, you should use `context.db` instead of `db` for accessing the database. The `context.db` is an enhanced Prisma client that enforces access policies.

    The "setup" command prepared a customized service code template. When you run `yarn rw g service`, the generated code will already use `context.db`.

Other Prisma-related workflows like generation migration or pushing schema to the database stay unchanged.

### Deployment

You should run the "generate" command in your deployment script before `yarn rw deploy`. For example, to deploy to Vercel, the command can be:

```bash
yarn rw @zenstackhq generate && yarn rw deploy vercel
```

### Using the `@zenstackhq` CLI plugin

The `@zenstackhq/redwood` package registers a set of custom commands to the RedwoodJS CLI under the `@zenstackhq` namespace. You can run it with:

```bash
yarn rw @zenstackhq <cmd> [options] 
```

The plugin is a simple wrapper of the standard `zenstack` CLI, similar to how RedwoodJS wraps the standard `prisma` CLI. It's equivalent to running `npx zenstack ...` inside the "api" directory.

See the [CLI references](/docs/reference/cli) for the full list of commands.

## Sample application

You can find a complete multi-tenant Todo application built with RedwoodJS and ZenStack at: [https://github.com/zenstackhq/sample-todo-redwood](https://github.com/zenstackhq/sample-todo-redwood).
