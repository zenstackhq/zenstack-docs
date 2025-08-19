---
sidebar_position: 4
---

# Type

Types provide a way to define complex data structures that are not backed by a database table. They server two purposes:

1. Types can be used as [mixins](../../modeling/mixin.md) to contain common fields and attributes shared by multiple models.
2. Types can be used to define [strongly typed JSON fields](../../modeling/typed-json.md) in models.

## Syntax

```zmodel
type NAME {
    FIELD*
    ATTRIBUTE*
}
```

-   **NAME**:

    Name of the model. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **FIELD**:

    Arbitrary number of fields. See [Field](./data-field.md) for details.

-   **ATTRIBUTE**:

    Arbitrary number of attributes. See [Attribute](./attribute.md) for details.

## Example

```zmodel
type Profile {
    age    Int
    gender String
}

type CommonFields {
    id        Int      @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model User with CommonFields {
    email   String   @unique
    name    String
    profile Profile? @json
}
```