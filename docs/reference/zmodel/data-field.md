---
sidebar_position: 6
---

# Data Field

Data fields are typed members of models and types.

## Syntax

```zmodel
model Model {
    FIELD_NAME FIELD_TYPE FIELD_ATTRIBUTES?
}
```

Or

```zmodel
type Type {
    FIELD_NAME FIELD_TYPE (FIELD_ATTRIBUTES)?
}
```

-   **FIELD_NAME**

    Name of the field. Needs to be unique in the containing model or type. Must be a valid identifier.

-   **FIELD_TYPE**

    Type of the field. Can be a scalar type, a reference to another model or type if the field belongs to a [model](./model.md), or a reference to another type if it belongs to a [type](./type.md).

    The following scalar types are supported:

    -   String
    -   Boolean
    -   Int
    -   BigInt
    -   Float
    -   Decimal
    -   Json
    -   Bytes
    -   Unsupported

    A field's type can be any of the scalar or reference type, a list of the aforementioned type (suffixed with `[]`), or an optional of the aforementioned type (suffixed with `?`).

-   **FIELD_ATTRIBUTES**

    Field attributes attach extra behaviors or constraints to the field. See [Attribute](./attribute.md) for more information.

## Example

```zmodel
model Post {
    // "id" field is a mandatory unique identifier of this model
    id String @id @default(uuid())

    // fields can be DateTime
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    // or string
    title String

    // or integer
    viewCount Int @default(0)

    // and optional
    content String?

    // and a list too
    tags String[]

    // and can reference another model too
    comments Comment[]
}
```