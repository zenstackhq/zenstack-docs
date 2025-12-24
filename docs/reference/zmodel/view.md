---
sidebar_position: 4
---

# View

Views are used to model SQL views in the database.

## Syntax

```zmodel
view NAME (with MIXIN_NAME(,MIXIN_NAME)*)? {
    FIELD*
    ATTRIBUTE*
}
```
-   **NAME**:

    Name of the model. Needs to be unique in the entire schema. Must be a valid identifier.

-   **FIELD**:

    Arbitrary number of fields. See [Field](./data-field.md) for details.

-   **ATTRIBUTE**:

    Arbitrary number of attributes. See [Attribute](./attribute.md) for details.

-   **MIXIN_NAME**:

    Name of a custom type used as a mixin. 

## Example

```zmodel
view UserInfo {
    id    Int
    email String
    name  String
}
```
