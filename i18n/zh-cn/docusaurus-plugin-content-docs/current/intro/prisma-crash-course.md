---
description: Prisma ORM速成班
sidebar_label: 1. Prisma速成班
sidebar_position: 1
---
# Prisma速成班

:::info
如果您已经熟悉Prisma，可直接跳到[下一节](/docs/intro/zmodel)。
:::

ZenStack是建立在Prisma ORM之上的，所以对它有一个基本的了解是很重要的。

Prisma是一个所谓的“模式优先”ORM，它简化了Node.js和TypeScript应用程序的数据库访问。 它为定义数据模型提供了一种直观而简洁的DSL（领域特定语言），并为访问数据库生成了一个类型安全的客户端。

本指南绝不是对Prisma的全面介绍，但它涵盖了理解和使用它的最基本部分。

### Prisma架构

您可以在名为`schema.prisma`的文件中定义数据模型。 下面是一个例子：

```zmodel

model User {
    id Int @id @default(autoincrement())
    email String @unique
    name String?
}

```

`User`模型包含一个主键`id`（由`@id`属性表示）、一个唯一`email`字段和一个可选的`name`字段。 `@default`属性指定字段的默认值，`autoincrement`函数指示数据库自动生成递增值。

建立关系也很容易。 下面的示例显示了与`User`模型具有一对多关系的`Post`模型。 `@relation`属性是通过将两个模型与一个外键相关联来连接这两个模型的键。

```zmodel

model User {
    id Int @id @default(@autoincrement())
    ...
    posts Post[]
}

model Post {
    id Int @id @default(@autoincrement())
    title String
    author User @relation(fields: [authorId], references: [id])
    authorId Int
}

```

### Prisma客户端

您可以运行Prisma CLI生成一个类型安全的客户端来访问数据库。

```bash
npx prisma generate
```

客户端被生成到`@prisma/client`包中，并可用于以下用途：

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// create a user
await prisma.user.create({
    data: { email: 'user1@abc.com' }
});

// create a user together with two related posts
await prisma.user.create({ 
    data: {
        email: 'user2@abc.com',
        posts: {
            create: [
                { title: 'Post 1' },
                { title: 'Post 2' }
            ]
        }
    }
});

// find posts with title containing some text, and return the author of each post together
const posts = prisma.post.findMany({
    where: { title: { contains: 'ZenStack' } },
    include: { author: true }
});

// here the `posts` is smartly inferred to be typed `Array<Post & { author: User }>`
console.log(posts[0].author.email);
```

### Prisma迁移

要将模式与数据库表和字段同步，请运行“migrate”命令：

```bash
npx prisma migrate dev
```

它将本地数据库转换为模式并生成迁移记录（用于在部署应用程序时重建数据库的模式）。

---

Prisma还有一组丰富的其他特性，这里没有介绍，比如模式迁移、数据浏览等， 但我们已经有足够的知识来理解和使用ZenStack。
