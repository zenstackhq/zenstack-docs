---
sidebar_position: 2
description: Using the CLI
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Using the CLI

ZenStack CLI is a command-line tool that takes the ZModel schema as input and complete different tasks for you. It's included in the "@zenstackhq/cli" package, and can be invoked with either `zen` or `zenstack` command (they are equivalent).

In the context of ORM, the CLI compiles ZModel into a TypeScript representation, which can in turn be used to create a type-safe ORM client.

You can try running the `npx zen generate` command in the following playground and inspect the TypeScript code generated inside the "zenstack" folder.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-quick-start" openFile="zenstack/schema.zmodel" />

The `generate` command generates several TypeScript files from the ZModel schema that support both development-time typing and runtime access to the schema. For more details of the generated code, please refer to the [@core/typescript plugin](../reference/plugins/typescript.md) documentation.
