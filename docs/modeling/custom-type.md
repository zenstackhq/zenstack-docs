---
sidebar_position: 7
description: Custom types in ZModel
---

import ZModelVsPSL from '../_components/ZModelVsPSL';
import AvailableSince from '../_components/AvailableSince';

# Custom Type

<ZModelVsPSL>
Custom type is a ZModel concept and doesn't exist in PSL.
</ZModelVsPSL>

Besides models, you can also define custom types to encapsulate complex data structures. The main difference between a model and a custom type is that the latter is not backed by a database table.

Here's a simple example:

```zmodel
type Address {
    street  String
    city    String
    country String
    zip     Int
}
```

Custom types are defined exactly like models. They can contain fields that are other custom types:

```zmodel
type Address {
    street  String
    city    String
    country String
    zip     Int
}

type UserProfile {
    gender  String
    address Address?
}
```

### Relation Fields

<AvailableSince version="v3.6.0" />

Custom types can also contain relation fields to models. This is particularly useful when used as [mixins](./mixin.md) to share relation field definitions across multiple models. For example, you can define an audit mixin that tracks who created and last updated a record:

```zmodel
type AuditMixin {
    id          String @id @default(cuid())
    createdBy   User    @relation("CreatedBy", fields: [createdById], references: [id])
    createdById String
    updatedBy   User    @relation("UpdatedBy", fields: [updatedById], references: [id])
    updatedById String
}

model Post with AuditMixin {
    title String
}

model Comment with AuditMixin {
    body String
}
```
:::warning
Custom types with relation fields can only be used as [mixins](./mixin.md). They cannot be used to type [JSON fields](./typed-json.md), since JSON fields cannot hold relational data.
:::

### Primitives

<AvailableSince version="v3.10.0" />

You can define custom types that use [validation](../reference/zmodel/input-validation) functions and attributes to shape primitive values rather than objects. This is useful for consolidating repetitive validation rules in your schema.

You must first select a *base type*, and then define a single non-nullable scalar field named `this`, whose type matches the base type you have chosen.

You may omit the `this` field if you only intend to use the type as an alias rather than perform any validation.

```zmodel
type NonEmptyString with String {
    this String @trim @length(min: 1)
}

type NonNegativeNumber with Int {
    this Int @gte(0)
}

type Contact with String {
    this String
    @@validate(isPhone(this) || isEmail(this))
}

model User {
    ...
    name     NonEmptyString
    age      NonNegativeNumber
    contacts Contact[]
}

type PostTag with String {
    this String @trim @lower @length(1, 12)
}

model Post {
    ...
    title NonEmptyString
    body  NonEmptyString
    views NonNegativeNumber
    tags  PostTag[]
}
```

:::info Validation Only
You can only use validation functions and attributes in the body of a primitive custom type.
:::

There are two more ways to use custom types:

- [Mixin](./mixin.md)
- [Strongly typed JSON fields](./typed-json.md)

