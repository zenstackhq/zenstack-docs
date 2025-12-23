---
sidebar_position: 10
description: Strongly typed JSON fields
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Strongly Typed JSON

<ZModelVsPSL>
Strongly typed JSON is a ZModel feature and doesn't exist in PSL.
</ZModelVsPSL>

With relational databases providing better and better JSON support, their usage has become more common. However, in many cases, your JSON fields still follow a specific structure, and when so, you can make the fields strongly typed so that:

- When mutating the field, its structure is validated.
- When querying the field, its result is strongly typed.

To type a JSON field, define a custom type in ZModel, use it as the field's type, and additionally mark the field with the `@json` attribute.

***Before:***

```zmodel
model User {
    id      Int  @id
    address Json
}
```

***After:***

```zmodel
type Address {
    street  String
    city    String
    country String
    zip     Int
}

model User {
    id      Int     @id
    address Address @json
}
```

:::info
The `@json` attribute serves no purpose today other than to indicate (for readability) that the field is a JSON field, not a relation to another model. We may extend it in the future for fine-tuning the JSON field's behavior.
:::

The migration engine still sees the field as a plain JSON field. However, the ORM client enforces its structure and takes care of properly typing the query results. We'll revisit this topic in the [ORM part](../orm/typed-json.md).
