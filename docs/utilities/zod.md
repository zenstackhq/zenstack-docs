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

    Creates a schema for the full shape of a model. By default, all scalar fields are included, and all relation fields are included as optional fields.

    <AvailableSince version="v3.5.0" />

    You can pass an optional second argument with `select`, `include`, or `omit` options to control which fields and relations are included in the resulting schema. These options work recursively for relation fields, mirroring the ORM's query API semantics.

    - **`select`** — pick only the listed fields. Set a field to `true` to include it with its default shape, or pass a nested options object for relation fields. Mutually exclusive with `include` and `omit`.
    - **`include`** — start with all scalar fields, then additionally include the named relation fields. Can be combined with `omit`.
    - **`omit`** — remove named scalar fields from the default set. Can be combined with `include`, but mutually exclusive with `select`.

    ```ts
    // Select specific fields only
    const schema = factory.makeModelSchema('User', {
        select: { id: true, email: true },
    });

    // Include a relation with nested selection
    const schema = factory.makeModelSchema('User', {
        select: {
            id: true,
            email: true,
            posts: {
                select: { id: true, title: true },
            },
        },
    });

    // Include relations on top of all scalar fields
    const schema = factory.makeModelSchema('User', {
        include: { posts: true },
    });

    // Omit specific scalar fields
    const schema = factory.makeModelSchema('User', {
        omit: { password: true },
    });

    // Combine include and omit
    const schema = factory.makeModelSchema('User', {
        include: { posts: true },
        omit: { password: true },
    });
    ```

    The resulting Zod schema is fully typed — the inferred TypeScript type reflects exactly which fields are present based on the options you provide.

- `makeModelCreateSchema`
  
    Creates a schema for creating new records, with fields that have defaults being optional. The result schema excludes relation fields.

- `makeModelUpdateSchema`

    Creates a schema for updating records, with all fields being optional. The result schema excludes relation fields.

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

