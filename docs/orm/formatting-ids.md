---
sidebar_position: 13
description: Formatting IDs in ZModel
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';

# Formatting IDs

<ZenStackVsPrisma>
ID formatting is a ZModel feature and doesn't exist in Prisma.
</ZenStackVsPrisma>

Prefixing and suffixing model IDs is becoming more common in database design, usually by including the model name in the generated ID. This aids debugging and troubleshooting because developers can easily spot when an ID of one model has been passed to a service expecting an ID of another model.

ZenStack supports this pattern via a new `format` parameter added to every ID function. Simply pass a format string to the function, and it will replace the `%s` sequence with the generated ID.

:::info
* Not all ID functions have the same signature. See [the function reference](../reference/zmodel/function#predefined-functions) for more details.
* It is considered an error if the format string does not contain `%s`
:::

```zmodel title='/schema.zmodel'
model User {
    id String @id @default(uuid(7, 'user_%s'))
    ...
}
```

In the future, this pattern may be implemented via the `@default` attribute directly, which would allow IDs to be generated via complex expressions rather than string formatting.