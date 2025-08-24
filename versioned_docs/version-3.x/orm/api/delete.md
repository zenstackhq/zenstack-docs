---
sidebar_position: 5
description: Delete API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Delete

Deleting records can be done with the following methods:

- `delete` - Delete a single, unique record.
- `deleteMany` - Delete multiple records that match the query criteria.
- `deleteManyAndReturn` - Similar to `deleteMany`, but returns the deleted records

You can also delete records as part of an `update` operation from a relation. See [Manipulating relations](./update.md#manipulating-relations) for details.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="delete.ts" startScript="generate,delete" />
