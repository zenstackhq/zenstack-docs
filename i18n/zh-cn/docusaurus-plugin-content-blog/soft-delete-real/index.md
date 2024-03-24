---
title: 'Soft Delete: Dealing With Unique Constraint in Real-World Case'
description: While idealism inspires innovation, it is the pragmatic, adaptable, and context-aware solutions that ultimately triumph in overcoming the real problems we face.
tags: [sql,database, software-development]
authors: jiasheng
date: 2023-07-26
image: ./cover.png
---

# Soft Delete: Dealing With Unique Constraint in Real-World Case

![Cover Image](./cover.png)
I introduced how to achieve soft delete in ZenStack in the previous post below:

[Soft delete: Implementation issues in Prisma and solution in ZenStack](/blog/soft-delete)

The solution appears quite elegant with the help of the access policy in the schema.
```tsx
model Post {
  ...
  deleted Boolean @default(false) @omit
  @@deny(‘read’, deleted)
  ...
}
```
<!--truncate-->

There are users who come to ZenStack specifically for the soft delete feature after reading the post:

![soft-delete-user](https://github.com/jiashengguo/my-blog-app/assets/16688722/2268fe16-bbf5-4bbb-878b-f34fd4b57e89)

This was an “aha” moment in building ZenStack for me to be able to provide an ideal solution for a very common issue:

![cheer](https://github.com/jiashengguo/my-blog-app/assets/16688722/5c5cf74b-e3c4-4f86-9e4e-c61b437ae3b6)

However, soon after, the ideal was shattered by reality.

# Real-world Problem

A user once asked how to create a partial index with a where condition in ZenStack to implement soft delete:

> yeah .. problem is if we implemented soft delete we need this partial index otherwise normal index will consider delete = true record as well .. And that's problem 🙁
> 

It immediately brought me back to three years ago when I encountered the same issue. Ironically, I even searched for the same article I had looked at three years ago 😂 : 

[Dealing with MySQL nulls and unique constraint](https://medium.com/@aleksandrasays/dealing-with-mysql-nulls-and-unique-constraint-d260f6b40e60)

TLDR,  the correct solution should be to make the `deleted` field an integer having the default value of 0.  When it is deleted, set the value to the timestamp of deletion:

```tsx
model Post {
    id String @id @default(uuid())
    // name should be unique
    name String
    // when deleting, set it to the timestamp of deletion
    deleted Int @default(0) @omit

    @@unique([name, deleted])
    @@deny('read', deleted != 0)
}
```

While it may not be as elegant as before, it is the solution that addresses the real-world problem.

# From Ideal to Reality

In the ever-evolving software world, we often come across solutions that appear flawless on the surface, promising to solve all our problems effortlessly. These seemingly perfect solutions may dazzle us with their elegance and efficiency, giving us a glimpse of an idealized future. However, as we venture deeper into the realm of real-world challenges, we discover that these picture-perfect solutions often fall short of addressing the complexities and intricacies that arise in practical scenarios. 

The software landscape is a realm where theory and practice sometimes diverge. While idealism inspires innovation, it is the pragmatic, adaptable, and context-aware solutions that ultimately triumph in overcoming the real problems we face.  Hence, it is important to always keep in mind the importance of real-world cases and make appropriate [trade-offs](https://zenstack.dev/blog/trade-off) based on them.

---

Apart from this one, there are certainly other instances within ZenStack that may represent ideal cases. If you believe ZenStack has the potential to assist you, we would deeply appreciate your collaboration in transforming those ideals into tangible realities.🤝

[https://github.com/zenstackhq/zenstack](https://github.com/zenstackhq/zenstack)