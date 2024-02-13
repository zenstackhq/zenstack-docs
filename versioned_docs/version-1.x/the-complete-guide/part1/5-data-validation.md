---
sidebar_label: 5. Data Validation
---

#  Data Validation

### Overview

Besides permission control, an application often also has a notion of data validity: what form of data is allowed to be stored in the database? Database schema provides a preliminary mechanism for defining that, but many rules still need to be enforced outside of it. Here are a few quick examples:

- `email` field must be a valid email address.
- `password` field must be at least 8 characters long.
- A post's `slug` must only contain letters, numbers, and dashes.
- `price` field must be a positive number.
- `password` field is only allowed to have value if `identityProvider` field is set to `credentials`.

Traditionally, developers either write imperative code to validate data or use a declarative validation library like [Zod](https://zod.dev). ZenStack allows you to define such rules right inside the ZModel schema and automatically enforces them with the enhanced Prisma Client. When validation rules are violated during a "create" or "update" operation, the operation is rejected with an error.

:::info

Data validation and access policy may have some similarities, but there are some fundamental differences:

1. Access policies are usually defined regarding the current user, while validation rules are defined against the data itself.
2. Access policies are mostly evaluated on the database side (through injection into Prisma queries), while data validation is evaluated entirely on the application side.
3. Access policies govern CRUD operations, while data validation only covers "create" and "update" actions.

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

All validation attributes also accept an extra parameter `message` for specifying a custom error message. For example:

```zmodel
model User {
    ...
    email String @unique @email('must be a valid email')
    password String @length(min: 8, max: 32, message: 'must be between 8 and 32 characters long')
}
```

### Model-Level Validation

You can use the model-level `@@validate` attribute to define validation rules that involve multiple fields. A set of helper functions are provided for building complex validation expressions. You can find the full list of such functions [here](/docs/reference/zmodel-language#model-level-validation-attributes). Here's an example:

```zmodel
model User {
    id String @id
    email String? @unique
    activated Boolean @default(false)
    @@validate(!activated || email != null, "activated user must have an email")
}
```

### 🛠️ Adding Data Validation

We can use data validation to improve our app's robustness in many places. Two such examples are shown here:

1. Make sure `User`'s email is a valid email address.

    ```zmodel
    model User {
        ...
        email String @unique @email
    }
    ```

2. Limit the format of `Space`'s slug.
   
   ```zmodel
    model Space {
         ...
         slug String @unique @regex('^[0-9a-zA-Z_\-]{4,16}$')
    }
    ```

Rerun generation and start REPL:

```bash
npx zenstack generate
npx zenstack repl
```

Try to create a user with an invalid email address:

```js
db.user.create({ data: { email: 'xyz.abc' } })
```

Observe the validation error:

```js
denied by policy: user entities failed 'create' check, input failed validation: Validation error:
Invalid email at "email"
Code: P2004
Meta: {
  reason: 'DATA_VALIDATION_VIOLATION',
  zodErrors: ZodError: [...]
}
```
