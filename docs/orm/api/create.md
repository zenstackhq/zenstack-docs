---
sidebar_position: 2
description: Create API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Create

The `create` series of APIs are used to create new records in the database. It has the following methods:

- `create`
    Create a single record, optionally with nested relations.
- `createMany`
    Create multiple records in a single operation. Nested relations are not supported. Only the number of records created is returned.
- `createManyAndReturn`
    Similar to `createMany`, but returns the created records.

Nested creates are executed in a transaction to ensure data integrity.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="create.ts" startScript="generate,create" />

