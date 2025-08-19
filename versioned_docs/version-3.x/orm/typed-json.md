---
sidebar_position: 12
description: Strongly typed JSON fields
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';
import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';
import GithubCodeBlock from '@site/src/components/GithubCodeBlock';

# Strongly Typed JSON

<ZenStackVsPrisma>
Strongly typed JSON is a ZModel feature and doesn't exist in Prisma.
</ZenStackVsPrisma>

ZModel allows you to define custom types and use them to [type JSON fields](../modeling/typed-json.md). The ORM respects such fields in two ways:

1. The return type of such fields is typed as TypeScript types derived from the ZModel custom type definition.
2. When creating or updating such fields, the ORM validates the input against the custom type definition. The engine "loosely" validates the mutation input and doesn't prevent you from including fields not defined in the custom type.

## Samples

<GithubCodeBlock repoPath="zenstackhq/v3-doc-orm-typed-json" file="zenstack/schema.zmodel"/>

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-typed-json" />
