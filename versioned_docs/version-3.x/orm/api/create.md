---
sidebar_position: 2
description: Create API
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Create

The `create` series of APIs are used to create new records in the database. It has the following methods:

- `create`
    Create a single record, optionally with nested relations.
- `createMany`
    Create multiple records in a single operation. Nested relations are not supported. Only the number of records created is returned.
- `createManyAndReturn`
    Similar to `createMany`, but returns the created records.

## Samples

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-create" />

## Input

The create APIs accept an input object with the following fields:

- `data`

    The data used to create the record. It must contain all non-optional fields of the model. It can also include nested object for creating or connecting relation entities. For `create` the data field must be an object. For `createMany` and `createManyAndReturn`, it can be either an object or an array of objects.

    This field is required.

- `skipDuplicates`

    A boolean flag that indicates whether to skip records that would violate unique constraints. Only applicable to `createMany` and `createManyAndReturn`.

    This field is optional and defaults to `false`.

You can also control what fields are turned in the result using the `select`, `include`, and `omit` fields. Read more about field selection in the [next section](./find.md#field-selection).

## Output

The output shape of `create` and `createManyAndReturn` API is determined by the `select`, `include`, and `omit` fields in the input object. The output of `createMany` is `{ count: number }`, giving the number of records created.
