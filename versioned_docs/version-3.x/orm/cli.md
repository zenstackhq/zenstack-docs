---
sidebar_position: 4
description: Using the CLI
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Using the CLI

ZenStack CLI is a command-line tool that takes the ZModel schema as input and complete different tasks for you. It's included in the "@zenstackhq/cli" package, and can be invoked with either `zen` or `zenstack` command.

In the context of ORM, the CLI compiles ZModel into a TypeScript representation, which can in turn be used to create a type-safe ORM client.

You can try running the `npx zen generate` command in the following playground and inspect the TypeScript code generated inside the "zenstack" folder.

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-quick-start" openFile="zenstack/schema.zmodel" />

The `generate` command outputs the following TypeScript files in the same folder of the schema file:

- `schema.ts`: TypeScript representation of the ZModel schema, used by the ORM client to understand the database's structure and infer types.
- `models.ts`: Exports types for all models, types, and enums defined in the schema.
- `input.ts`: Export types that you can use to type the arguments passed to the ORM client methods, such as `findMany`, `create`, etc.
