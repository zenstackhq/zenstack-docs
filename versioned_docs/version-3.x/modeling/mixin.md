---
sidebar_position: 8
description: Reusing common fields with mixins
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Mixin

<ZModelVsPSL>
Mixin is a ZModel concept and don't exist in PSL.
</ZModelVsPSL>

:::info
Mixin was previously known as "abstract inheritance" in ZenStack v2. It's renamed and changed to use the `with` keyword to distinguish from polymorphic model inheritance.
:::

Very often you'll find many of your models share quite a few common fields. It's tedious and error-prone to repeat them. As a rescue, you can put those fields into custom types, and "mix-in" them into your models.

***Before:***

```zmodel
model User {
    id        String @id
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    email     String @unique
}
```

***After:***

```zmodel
type BaseFieldsMixin {
    id        String   @id
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model User with BaseFieldsMixin {
    email String @unique
}
```

A model can use multiple mixins as long as their field names don't conflict.

Mixins don't exist at the database level. The fields defined in the mixin types are conceptually inlined into the models that use them.
