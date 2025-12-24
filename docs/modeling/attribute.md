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
    id    Int    @id
    email String @unique

    @@index([email, name])
}
```

## Defining and applying attributes

<ZModelVsPSL>
Prisma schema doesn't allow users to define custom attributes, while ZModel allows it and uses it as a key mechanism for extensibility.
</ZModelVsPSL>

ZModel comes with a rich set of attributes that you can use directly. See [ZModel Language Reference](../reference/zmodel/attribute#predefined-attributes) for a complete list. You can also define your own attributes for specific purposes. Attributes are defined with a list of typed parameters. Parameters can be named (default) or positional. Positional parameters can be passed with or without an explicit name. Parameters can also be optional.

Here's an example of how the `@@index` attribute is defined:

```zmodel
attribute @@index(_ fields: FieldReference[], name: String?, map: String?)
```

You can apply it in various ways:

```zmodel
model A {
    id Int @id
    x  String
    @@index([x]) // positional parameter
}

model B {
    id Int @id
    x  String
    @@index([x], name: 'b_index') // positional and named parameters
}

model C {
    id Int @id
    x  String
    @@index(fields: [x], name: 'c_index') // all named parameters
}
```

Read the [ZModel Language Reference](../reference/zmodel/attribute#syntax) for more details on how to define and use attributes.
