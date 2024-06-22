---
description: 增强型Prisma客户端
sidebar_label: 3. 增强型Prisma客户端
sidebar_position: 3
---

# 增强型Prisma客户端

ZModel语言允许我们使用Prisma无法实现的语义来丰富我们的数据模型。 类似地，在运行时中，ZenStack提供了***增强***Prisma客户端实例的API。 这些增强是透明代理，因此它们具有与常规Prisma客户端完全相同的API，但添加了额外的行为。

最令人感兴趣的增强是访问策略的执行。 假设我们有以下ZModel：

```zmodel
model User {
    id Int @id
    posts Post[]

    // user-related access policies are omitted
    // ...
}

model Post {
    id Int @id
    title String @length(5, 255)
    published Boolean @default(false)
    author User @relation(fields: [authorId], references: [id])
    authorId Int

    // 🔐 author has full access
    @@allow('all', auth() == author)

    // 🔐 logged-in users can view published posts
    @@allow('read', auth() != null && published)
}
```

您可以在下面的代码片段中看到增强的工作原理：

```ts

// create a regular Prisma Client first
const prisma = new PrismaClient();

// create two users and a post for each

// user#1 => post#1
await prisma.user.create({
    data: {
        id: 1,
        posts: { create: [{ id: 1, title: 'Post 1' }] }
    }
})

// user#2 => post#2
await prisma.user.create({
    data: {
        id: 2,
        posts: { create: [{ id: 2, title: 'Post 2' }] }
    }
})


// the call below returns all posts since there's no filtering
const posts = await prisma.post.findMany();
assert(posts.length == 2, 'should return all posts');

// create a policy-enhanced wrapper with a user context for user#1
import { enhance } from '@zenstackhq/runtime';
const enhanced = enhance(prisma, { user: { id: 1 }});

// even without any filtering, the call below only returns
// posts that're readable by user#1, i.e., [post#1]
const userPosts = await enhanced.post.findMany();
assert(userPosts.length == 1 && userPosts[0].id == 1], 'should return only post#1');

// ❌ the call below fails because user#1 is not allowed to update post#2
await enhanced.post.update({
    where: { id: 2 },
    data: { published: true }
});

// ❌ the call below fails because "title" field violates the `@length` constraint
await enhanced.post.create({
    data: { title: 'Hi' }
});

```

在构建后端服务时，您可以使用访问策略将授权问题集中到模式中，然后在整个服务代码中使用增强的Prisma Client。 这种做法可以带来三个明显的好处：

- 更小的代码库。
- 与手动编写授权逻辑相比，这是一个更安全、更可靠的结果。
- 更好的可维护性，因为当授权规则发展时，模式是唯一需要进行更改的地方。

您可以[在此处](/docs/guides/understanding-access-policy)找到有关访问策略的更多信息。

事实上，如果服务主要是CRUD，那么您可能根本不需要实现后端服务。 使用访问控制增强的Prisma客户端，可以自动生成成熟的CRUD服务。 让我们在下一节中看看它是如何工作的。