---
sidebar_position: 9
description: Input validation in ZModel
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Input Validation

<ZenStackVsPrisma>
Input validation is a ZModel feature and doesn't exist in Prisma.
</ZenStackVsPrisma>

:::warning
Input validation is only applied to the ORM APIs like `create`, `update`, etc. It's not enforced at the query builder level.
:::

When defining a model field in ZModel, you specify its type, which provides a basic level of runtime validation - when an incompatible value is passed to the field during creation or update, the ORM engine will reject the operation.

However, oftentimes you want to express more fine-grained validation rules, such as field length, string format, or numeric range, etc. ZModel provides a set of built-in field-level validation attributes, like `@length`, `@email`, etc., for this purpose. See [Input Validation](../reference/zmodel/input-validation.md) for more details.

To support more complex rules, a powerful `@@validate` model-level attribute is provided to allow expression rules using multiple fields and logical operators. Inside the `@@validate` attribute, functions like `length()`, `isEmail()`, etc. are available for building up expressions. See [Input Validation](../reference/zmodel/input-validation.md) for the complete list of available functions.

Arguments of mutation operations are validated before sending them to the database. When a validation rule is violated, an `InputValidationError` exception is thrown, containing details about the violations.

Internally, ZenStack uses [Zod](https://zod.dev/) to perform validation. Most of the attributes and functions are 1:1 mapped to Zod APIs.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-validation" codeFiles={['zenstack/schema.zmodel', 'main.ts']} />
