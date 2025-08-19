---
sidebar_position: 2
---

# Model

Models represent the business entities of your application. A model can have zero or more [mixins](../../modeling/mixin.md), and zero or one [polymorphic base models](../../modeling/polymorphism.md).

## Syntax

```zmodel
model NAME (with MIXIN_NAME(,MIXIN_NAME)*)? (extends BASE_NAME)? {
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

-  **BASE_NAME**:

    Name of a polymorphic base model.

## Note

A model must be uniquely identifiable by one or several of its fields. In most cases, you'll have a field marked with the `@id` attribute. If needed, you can use multiple fields as unique identifier by using the `@@id` model-level attribute.

If no `@id` or `@@id` is specified, the field(s) marked with the `@unique` or `@@unique` attribute will be used as fallback identifier.

## Example

```zmodel
type CommonFields {
    id       Int       @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model User with CommonFields {
    email String @unique
    name  String
}
```
