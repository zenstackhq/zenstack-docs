---
sidebar_position: 14
description: TypeScript types derived from the ZModel schema
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Schema-Inferred Types

Most of the time, you don't need to explicitly type the input and output of the ORM methods, thanks to TypeScript's powerful inference capabilities. However, when you do have the need, you can rely on the following utilities to type things:

- `zenstack/models`

    The `zen generate` command generates a `models` module that exports types for all models, types, and enums. The model types include all scalar fields (including computed ones).

- `zenstack/input`

    The `zen generate` command generates an `input` module that exports types for input arguments of the ORM methods, such as `UserCreateArgs`, `PostUpsertArgs`, etc. You can use them to type intermediary variables that are later passed to the ORM methods.

- `ModelResult`

    The `ModelResult` generic type from `@zenstackhq/runtime` allows you to infer the exact model type given field selection and relation inclusion information.

## Samples

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm" openFile="inferred-types.ts" startScript="generate" />
