---
sidebar_label: 6. Data Validation
---

#  Data Validation

### Overview

Besides permission control, an application often also have a notion of data validity: what form data is allowed to be stored in the database. Database schema provides a preliminary for defining that, many rules need to be enforced outside the database. A few quick examples:

- `email` field must be a valid email address.
- `password` field must be at least 8 characters long.
- A post's `slug` must only contain letters, numbers, and dashes.
- `price` field must be a positive number.
- `password` field is only allowed to have value if `identityProvider` field is set to `credentials`.

Traditionally developers either write imperative code to validate data, or use a declarative validation library like [Zod](https://zod.dev). ZenStack allows you to define such rules right inside the ZModel file and automatically enforces them with the enhanced Prisma Client. When validation rules are violated during a "create" or "update" operation, the operation is rejected with an error.

:::info

Data validation and access policy may have some similarities, but they are some fundamental differences:

1. Access policies are usually defined in terms of the current user, while validation rules are defined against the data itself.
2. Access policies are mostly evaluated on the database side (through injection into Prisma queries), while data validation is evaluated entirely on the application side.
3. Access policies governs CRUD operations, while data validation is only evaluated for "create" and "update" operations.

:::

### Field-Level Validation

ZenStack provides a set of field-level attributes for defining validation rules. You can find the full list of such attributes [here](/docs/reference/zmodel-language#field-level-validation-attributes). Here are a few usage examples:

```zmodel
model User {
    id Int @id
    email String @unique @email @endsWith('@zenstack.dev')
    imgUrl String? @url
    password String @length(min: 8, max: 32)
    age Int @gt(0) @lt(120)
}
```

### Model-Level Validation

You can use the model-level `@@validate` attribute to define validation rules that involve multiple fields. A set of helper functions are provided for building complex validation expressions. You can find the full list of such functions [here](/docs/reference/zmodel-language#model-level-validation-attributes). Here are a few usage examples:

```zmodel
model User {
    id String @id
    email String? @unique
    activated Boolean @default(false)
    @@validate(!activated || email != null, "activated user must have an email")
}
```
