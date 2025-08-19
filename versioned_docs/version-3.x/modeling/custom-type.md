---
sidebar_position: 7
description: Custom types in ZModel
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

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

Custom types are defined exactly like models, with the exception that they cannot contain fields that are relations to other models. They can, however, contain fields that are other custom types.

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

There are two ways to use custom types:

- [Mixin](./mixin.md)
- [Strongly typed JSON fields](./typed-json.md)
