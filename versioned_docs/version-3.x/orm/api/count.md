---
sidebar_position: 6
description: Count API
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Count

You can use the `count` method to count the number of records that match a query. It also allows to count non-null field values with an `select` clause.

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-count" openFile="main.ts" startScript="generate,dev" />

To count relations, please use a `find` API with the special `_count` field as demonstrated in the [Find](./find.md#field-selection) section.
