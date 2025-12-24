---
sidebar_position: 6
description: Enums in ZModel
---

# Enum

Enums are simple constructs that allow you to define a set of named values.

```zmodel
enum Role {
    USER
    ADMIN
}
```

They can be used to type model fields:

```zmodel
model User {
    id   Int  @id
    // highlight-next-line
    role Role @default(USER)
}
```

Enum field names are added to the global scope and are resolved without qualification. You need to make sure they don't collide with other global names.