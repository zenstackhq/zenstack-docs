---
sidebar_position: 1
description: Zod schema generation from ZModel
---

import PackageInstall from '../_components/PackageInstall';
import AvailableSince from '../_components/AvailableSince';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Zod

<AvailableSince version="v3.4.0" />

The `@zenstackhq/zod` package generates [Zod](https://zod.dev/) validation schemas from your ZModel definitions. It provides type-safe schemas for models, embedded types, and enums, with full support for validation attributes and custom validation rules.

## Installation

<PackageInstall dependencies={["@zenstackhq/zod", "zod"]} />

Zod 4.0 or above is required.

## API

The package exports a `createSchemaFactory` function that takes a ZenStack schema as input and returns a factory for creating Zod schemas.

```ts
import schema from './zenstack/schema';
import { createSchemaFactory } from '@zenstackhq/zod';

const factory = createSchemaFactory(schema);
```

The factory exposes the following methods:

- `makeModelSchema`
    
    Creates a schema for the full shape of a model, including relation fields (as optional fields).

- `makeModelCreateSchema`
  
    Creates a schema for creating new records, with fields that have defaults being optional. The result schema exclude relation fields.

- `makeModelUpdateSchema`

    Creates a schema for updating records, with all fields being optional. The result schema exclude relation fields.

- `makeTypeSchema`

    Creates a schema for a [Custom Type](../modeling/typed-json).

- `makeEnumSchema`

    Creates a schema for an enum type.

## Schema Features

The created Zod schemas have the following features:

1. They are strongly typed.
1. They verify the basic shapes of input args (object fields and types).
1. They respect the additional validation attributes like `@email`, `@length`, etc., as described in [Input Validation](../orm/validation.md).
1. If a ZModel declaration has a `@@meta` or `@meta` attribute with "description" key, the meta value will be used as the Zod schema's metadata.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-zod" openFile={['zenstack/schema.zmodel', 'main.ts']} />

