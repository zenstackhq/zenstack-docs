---
sidebar_position: 1
description: ZModel overview
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Data Modeling Overview

ZenStack uses a schema language named **ZModel** to define data models and their related aspects. We know that designing a good schema language is difficult, and we know it's even more difficult to convince people to learn a new one. So we made the decision to design ZModel as a superset of the [Prisma Schema Language (PSL)](https://www.prisma.io/docs/orm/prisma-schema), which is one of the best data modeling language out there.

If you're already familiar with PSL, you'll find yourself at home with ZModel. However, we'd still recommend that you skim through this section to learn about the important extensions we made to PSL. Please pay attention to callouts like the following one:

<ZModelVsPSL>
ZModel uses the explicit `import` syntax for composing multi-file schemas.
</ZModelVsPSL>

Don't worry if you've never used Prisma before. This section will introduce all aspects of ZModel, so no prior knowledge is required.

A very simple ZModel schema looks like this:

```zmodel title='zenstack/schema.zmodel'
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

model User {
    id    Int    @id @default(autoincrement())
    email String @unique
    name  String
}

model Post {
    id    Int    @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    title     String
    content   String
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  String
}
```

<ZModelVsPSL>
Prisma has the concept of "generator" which provides a pluggable mechanism to generate artifacts from PSL. Specifically, you need to define a "prisma-client-js" (or "prisma-client") generator to get the ORM client.

ZenStack CLI always generates a TypeScript schema without needing any configuration. Also, it replaced PSL's "generator" with a more generalized "plugin" construct that allows you to extend the system both at the schema level and the runtime level. Read more in the [Plugin](./plugin) section.
</ZModelVsPSL>

Let's dissect it piece by piece.
