---
sidebar_position: 11
description: Breaking down complex schemas into multiple files
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Multi-File Schema

<ZModelVsPSL>
Prisma uses an implicit approach that simply merges all schema files in a folder. ZModel uses explicit `import` syntax for better clarity and flexibility.
</ZModelVsPSL>

When your schema grows large, you can break them down to smaller files and stitch them together using the `import` statement.

```zmodel title="zenstack/user.zmodel"
import './post'

model User {
    id    Int   @id
    posts Post[]
}
```

```zmodel title="zenstack/post.zmodel"
import './user'

model Post {
    id       Int    @id
    content  String
    author   User   @relation(fields: [authorId], references: [id])
    authorId Int
}
```

```zmodel title="zenstack/schema.zmodel"
import './user'
import './post'
```

After type-checking, these files are merged into a single schema AST before passed to the downstream tools.

