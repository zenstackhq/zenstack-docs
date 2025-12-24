---
sidebar_position: 3
---

# Enum

Enums are container declarations for grouping constant identifiers. You can use them to express concepts like user roles, product categories, etc.

### Syntax

```zmodel
enum NAME {
    FIELD*
}
```

-   **ENUM_NAME**

    Name of the enum. Needs to be unique in the entire model. Must be a valid identifier.

-   **FIELD**

    Field identifier. Needs to be unique in the model. Must be a valid identifier.

### Example

```zmodel
enum UserRole {
    USER
    ADMIN
}
```