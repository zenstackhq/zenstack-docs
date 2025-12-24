---
sidebar_position: 6
description: Count API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Count

You can use the `count` method to count the number of records that match a query. It also allows to count non-null field values with an `select` clause.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="count.ts" startScript="generate,count" />

To count relations, please use a `find` API with the special `_count` field as demonstrated in the [Find](./find.md#field-selection) documentation.
