---
title: Stories Behind ZenStack V2
description: the main features of ZenStack V2 and the stories behind it.
tags: [zenstack, polymorphism, edge, prisma, vscode]
authors: jiasheng
date: 2024-04-26
image: ./cover.jpg
---

# Stories Behind ZenStack V2!

![Cover Image](cover.jpg)

After polishing ZenStack V2 in the future branch for more than two months, we are happy to make it official now. I would like to take this opportunity to briefly show you the main features of V2 and the stories behind it.
<!--truncate-->

## Polymorphic Relations

This feature is actually the reason we created V2. It's one of the most desired features of Prisma, which you can see from the reactions to the two related GitHub issues:

- [Support for a Union type #2505](https://github.com/prisma/prisma/issues/2505)
- [Support for Polymorphic Associations #1644](https://github.com/prisma/prisma/issues/1644)

Some folks even think that an ORM is incomplete without polymorphism support.

As the believer and enhancer of Prisma,  one of our strategies is to pick up where Prisma has left.  So, it did come to our radar at the early stage:

[Support for Polymorphic Associations #430](https://github.com/zenstackhq/zenstack/issues/430)

It quickly became one of the most desired features of ZenStack too.  Not only for the reactions themselves but also because more issues actually depend on it: 

- [ZenStack does not let me define multiple fields that are referencing the same model #653](https://github.com/zenstackhq/zenstack/issues/653)
- [Support implicit inversed relationship #613](https://github.com/zenstackhq/zenstack/issues/613)

However, we know it’s a non-trivial task.  Therefore, instead of rushing into the implementation, we wrote a blog post first to explain our approach and send it to the communities of both Prisma and ZenStack to get their feedback:

[Tackling Polymorphism in Prisma](https://zenstack.dev/blog/polymorphism)

The feedback has exceeded our expectations. One guy even refers to it as **christmas magic:**

[![github-comments](https://github.com/zenstackhq/zenstack/assets/16688722/efb6fef1-c5be-4a72-8a84-837e405f2da0)](https://github.com/prisma/prisma/issues/1644#issuecomment-1867913252)

Gaining enough confidence, we began working on the implementation. Our confidence was further boosted when Prisma mentioned it as a third-party solution in its official blog, even though the feature was still in the alpha stage:

[Table inheritance | Prisma Documentation](https://www.prisma.io/docs/orm/prisma-schema/data-model/table-inheritance#third-party-solutions)

Now, you can fully enjoy it with the latest version of ZenStack:

[Polymorphic Relations](https://zenstack.dev/docs/guides/polymorphism)

Why you should use it? checkout the below post to illustrate the benefit with the real example:

[End-To-End Polymorphism: From Database to UI, Achieving SOLID Design](https://zenstack.dev/blog/ocp)

## Edge Support

This is a surprising gift we received from Prisma.  Previously, when a user asked if ZenStack could run on Edge, we would direct them to the [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) proxy, as it was the only way to do it.  However, not all users are willing to use another service. This situation is frustrating for us because, unlike resolving polymorphism, we can't fully address it from ZenStack unless reimplementing the entire Prisma engine.   

Fortunately, Prisma sent us [a fantastic gift](https://www.prisma.io/blog/prisma-orm-support-for-edge-functions-is-now-in-preview) at the start of 2024. Without hesitation, we began tweaking ZenStack to ensure its compatibility with the edge runtime.  Even though the workload is minimal compared to polymorphism, we gained substantial knowledge throughout the process. If you're also planning to adapt to the Edge runtime, we hope our experience can save you some time:

[Adapting ZenStack to the Edge: Our Struggles and Learnings](https://zenstack.dev/blog/adapt-to-edge)

By the way, Edge support is in preview for both Prisma and ZenStack, so if you run into any issues, feel free to contact us via [Twitter](https://twitter.com/zenstackhq), [Discord](https://discord.gg/Ykhr738dUe), or [GitHub](https://github.com/zenstackhq/zenstack). 

## `auth()` in `default()`

This is a very special feature.  The brilliant idea came from one of our users at a very early time:

[Support for auth() in @default annotation #310](https://github.com/zenstackhq/zenstack/issues/310)

The best part is that right before we started to consider whether to implement it in V2,  another user sent out a PR for it:

[Support for auth() in @default attribute #958](https://github.com/zenstackhq/zenstack/pull/958)

This is the first feature of ZenStack that is fully implemented by the community. We would like to express our gratitude by sharing the author’s [GitHub profile link](https://github.com/Azzerty23) here.

It once again shows the benefit of using declarative schema to reduce the duplication of imperative code:

- before
    
    ```jsx
    //schema.zmodel
    model Post {
      ...
      owner User @relation(fields: [ownerId], references: [id])
      ownerId Int
    }
    
    //xxx.ts
    const db = enhance(prisma, { user });
    await db.post.create({
      data: {
       owner: { connect: { id: user.id } },
       title: 'Post1'
      }
    })
    ```
    
- after
    
    ```jsx
    //schema.zmodel
    model Post {
      ...
      owner User @relation(fields: [ownerId], references: [id])
      ownerId Int @default(auth().id) // <- assign ownerId automatically
    }
    
    //xxx.ts
    const db = enhance(prisma, { user });
    await db.post.create({ data: { title: 'Post1' } });
    ```
    

## VSCode Auto-Formatting

This is the feature I regret the most.   In fact, I would call it a fix instead of a feature because I did implement it in V1:

[![twitter-link](https://github.com/zenstackhq/zenstack/assets/16688722/e7aff6aa-568a-4edf-aec9-44e741f2ca22)](https://twitter.com/jiashenggo/status/1720036341642154260)

I mentioned “minimize disruptions for prisma users”,  but you know what? It was actually a lie.  Although I tried to make ZModel look as same as Prisma, it used a different indentation style:

![style-compare](https://github.com/zenstackhq/zenstack/assets/16688722/560d8544-8197-4996-890f-ca42b2613e5c)

Which one do you think looks better? 😉  I convinced myself that the left one was better due to its consistency with TS style. Why need consistency with TS? Because it includes the access policy code.   

It turns out that all of that was just an excuse to avoid making changes.  Even when I realized it soon, I found another excuse that the change would disturb existing users.  You can see how skilled our mind is at finding excuses to avoid work.  However, it struggles to estimate the actual workload accurately because it attempts to avoid it.  

The total time I spent to implement it is just a couple of hours which even includes flags both in VSCode extension and CLI to give the user the option to preserve the old style if he likes:

![vscode-option](https://github.com/zenstackhq/zenstack/assets/16688722/c83a2aeb-cb7f-4f1a-b966-6943db558527)

```bash
Usage: zenstack format [options]

Format a ZenStack schema file.

Options:
  --no-prisma-style  do not use prisma style
```

Don't let inertia obscure the truth; use your heart to find the right path and pursue it.

# Final Words

You can find the complete change detail in the below post:

[Upgrading to V2](https://zenstack.dev/docs/upgrade-v2)

In the Game of Thrones series finale, Tyrion Lannister said the following words:

> What unites people? Armies? Gold? Flags? Stories. There's nothing in the world more powerful than a good story.

These features will probably be forgotten as time passes or even not used at all by most people. But I hope the stories behind them could still have some meaning for you.