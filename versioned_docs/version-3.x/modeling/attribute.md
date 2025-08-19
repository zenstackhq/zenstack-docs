---
sidebar_position: 4
description: Attributes in ZModel
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Attribute

Attributes allow you to attach metadata to models and fields. As you've seen in the previous sections, they are used for many purposes, such as adding unique constraints and mapping names. Attributes are also indispensable for modeling relations between models.

## Naming conventions

By convention, attributes attached to models use a double `@@` prefix, while those for fields use a single `@` prefix.

```zmodel
model User {
    id        Int    @id
    email     String @unique

    @@index([email, name])
}
```

## Defining and applying attributes

<ZModelVsPSL>
Prisma schema doesn't allow users to define custom attributes, while ZModel allows it and uses it as a key mechanism for extensibility.
</ZModelVsPSL>

ZModel comes with a rich set of attributes that you can use directly. See [ZModel Language Reference](../category/zmodel-language) for a complete list. You can also define your own custom attributes for specific purposes. Attributes are defined with a list of typed parameters. Parameters can be named (default) or positional. Positional parameters can be passed with or without an explicit name. Parameters can also be optional.

Here's an example of how the `@unique` attribute is defined:

```zmodel
attribute @unique(map: String?, length: Int?, sort: SortOrder?)
```

You can apply it in various ways:

```zmodel
model Foo {
    x String @unique() // default application
    y String @unique('y_unique') // positional parameter
    z String @unique(map: 'z_unique', length: 10) // named parameter
}
```
