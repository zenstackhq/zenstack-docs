---
sidebar_position: 1
description: ZModel overview
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Data Modeling Overview

ZenStack uses a schema language named **ZModel** to define data models and their related aspects. We know that designing a good schema language is difficult, and we know it's even more challenging to convince people to learn a new one. We therefore decided to design ZModel as a superset of the [Prisma Schema Language (PSL)](https://www.prisma.io/docs/orm/prisma-schema), one of the best data modeling languages available.

If you're already familiar with PSL, you'll find yourself at home with ZModel. However, we recommend that you skim through this section to learn about the essential extensions we made to PSL. Please pay attention to callouts like the following:

<ZModelVsPSL>
ZModel allows both single quotes and double quotes for string literals.
</ZModelVsPSL>

Don't worry if you've never used Prisma before. This part of documentation will introduce all aspects of ZModel, so no prior knowledge is required.

A simplest ZModel schema looks like this:

```zmodel title='zenstack/schema.zmodel'
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

model User {
    id    Int    @id @default(autoincrement())
    email String @unique
    name  String
    posts Post[]
}

model Post {
    id        Int      @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    title     String
    content   String
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
}
```

<ZModelVsPSL>
Prisma has the concept of "generator", which provides a pluggable mechanism to generate artifacts from PSL. Specifically, you need to define a "prisma-client-js" (or "prisma-client") generator to get the ORM client.

ZenStack CLI generates a TypeScript schema without needing any configuration. Also, it replaced PSL's "generator" with a more generalized "plugin" construct that allows you to extend the system both at the schema level and the runtime level. Read more in the [Plugin](./plugin) section.
</ZModelVsPSL>

Let's dissect it piece by piece.
