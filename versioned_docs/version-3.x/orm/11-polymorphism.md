---
description: Polymorphic models
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Polymorphic Models

<ZenStackVsPrisma>
Polymorphic models is a major feature that sets ZenStack apart from Prisma.
</ZenStackVsPrisma>

ZenStack natively supports polymorphic models. As we have seen in the [Polymorphism](../modeling/polymorphism.md) section in the data modeling part, the ZModel language allows you to define models with Object-Oriented style inheritance. This section will describe the ORM runtime behavior of polymorphic models.

## CRUD behavior

Polymorphic models' CRUD behavior is similar to that of regular models, with two major differences:

1. Base model entities cannot be created directly as they cannot exist without an associated concrete model entity.
2. When querying a base model (either top-level or nested), the result will include all fields of the associated concrete model (unless fields are explicitly selected). The result's type is a discriminated union, so you can use TypeScript's type narrowing to access the concrete model's specific fields.

The ORM query API hides all the complexity of managing polymorphic models for you:
- When creating a concrete model entity, its base entity is automatically created.
- When querying a base entity, the ORM fetches the associated concrete entity and merges the results.
- When deleting a base or concrete entity, the ORM automatically deletes the counterpart entity.

## Samples

The schema used in the sample involves a base model and three concrete models:

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-polymorphism" codeFiles={['zenstack/schema.zmodel', 'main.ts']} startScript="generate,dev" />
