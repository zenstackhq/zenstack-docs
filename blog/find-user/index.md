---
title: How to find users for open source project with no resources and connections
description: helpful tips on how to attract users based on our real experience.
tags: [zenstack, opensource]
authors: jiasheng
date: 2023-03-05
image: ./cover.png
---

# How to find users for open source project with no resources and connections

![Cover Image](cover.png)

If you are starting your first Open Source Project with no resources and connections, this post aims to provide some helpful tips on how to attract users based on our personal experience.

<!--truncate-->

## Background

My co-founder and I started to build our OSS full-stack toolkit ZenStack in Oct 2022, the first version was released to the public in Nov 2022. This is the first time for us to really get involved in the OSS world, and we are not planning to spend any money on the promotion. So basically, no resources, no connections.

After 4 months passed, and below are some basic metrics we have now:

-   GitHub stars: 152
-   Website DAU(peek): 190
-   Discord users: 56
-   Known potential production usage: 2

I don’t know how would you feel about the result, I personally feel content with the results. In terms of what I gained from this experience, my takeaway is:

**Keep doing the right things and wait for the good thing to happen**

Typically, engineers are accustomed to immediate feedback from their work - write code, run it, and see results. However, this is not the case when it comes to open-source projects. It could take a significant amount of time before the project garners attention from users. In order to increase the chances of your project being discovered by potential customers, consider it as a probability game - with every effort you make, you increase the likelihood of someone finding out about your project. Even if there is a high probability that someone could stumble upon it, they may still be unaware of it. Therefore, the key is to persistently increase the possibility of the project's discovery, so that one day, it may catch the attention of a potential user.

## 3 most important right things to do

### Write content for the potential audience

Unless you can precisely identify and reach out to your target audience, I think the only way to find your users is to write content to attract and retain an audience.

Here are two tips from my own experience:

-   Your content need not overtly promote your project.
    Creating a post to highlight the benefits of your project and attract potential customers is a typical and reasonable approach. This is, after all, the primary objective of the project. As an example, below are some of the posts we composed at the outset:

    -   [How to Build a Production-Ready Todo App in One Next.js Project With ZenStack](https://dev.to/zenstack/how-to-build-a-production-ready-todo-app-in-one-nextjs-project-with-zenstack-2acc)
    -   [Introducing ZenStack: a schema-first toolkit for creating CRUD services in Next.js projects](https://dev.to/zenstack/introducing-zenstack-a-schema-first-toolkit-for-creating-crud-services-in-nextjs-projects-272d)

    However, the outcomes were disappointing. The issue at hand was that, despite your conviction in the project's value proposition and outlining how it addresses user needs, you have not established any credibility with your audience. Every seller would assert that their product is exceptional, but why should the audience trust them? The audience must have confidence in you before they will purchase from you. The trust-building process would be much easier if the audience did not feel as if they were being sold something.
    As a result, we modified our approach by creating content that shares beneficial knowledge in the relevant technology field of our project without explicitly promoting its advantages. We only mention the project at the conclusion, such as:

    > Introducing ZenStack: a toolkit that supercharges Prisma ORM with a powerful access control layer and unleashes its full potential for full-stack development.

    This method led to the formation of a highly loyal audience, which became the primary source of user acquisition for ZenStack.

-   you could do it even before your project is ready to go
    If you adhere to the first suggestion, this one becomes self-evident. If you establish trust with your audience, they are likely to peruse any content you produce, as long as it is relevant to their interests.

Predicting the number of views your content will receive is exceedingly difficult. On occasion, you may spend days devising a highly satisfying post, only to have it viewed by a few hundred people. Conversely, a post detailing your day-to-day work, such as the example below, may attract over 30,000 views:

[How to solve coding issues using ChatGPT](https://dev.to/zenstack/how-to-solve-coding-issues-using-chatgpt-15dd)

As a result, it is preferable to concentrate on producing content on a regular basis rather than focusing excessively on the outcome.

Here are some basic metrics in dev.to we got so far:

-   34 posts
-   2k followers
-   162K views

### Attend conferences and meetups

Conducting offline events is a popular method of promoting new projects to audiences. It provides an excellent opportunity to connect with a highly engaged audience and establish deeper personal relationships. This approach is especially effective if the gathering's topic is related to your project, allowing you to become an active participant in the community. Not only can you receive feedback from a diverse audience, but you can also gain inspiration by learning about what other individuals are working on.

The first meeting I attended is a GraphQL vs tRPC meeting below:

[GraphQL or tRPC Data Discussion](https://youtu.be/TFTpOn-MvCA)

Even though I did not have the opportunity to discuss ZenStack with anyone, the meeting provided several benefits:

-   Alex, the author of tRPC, was able to respond to several of my inquiries regarding the future of tPRC which is helpful for ZenStack to determine our next steps.
-   I spoke to an employee of Prisma about the feature plan and they suggested that I post it in the GitHub issue. (I will show you why and how good it is later 😉)
-   After attending the meeting, I discovered that numerous younger individuals lacked knowledge about the history of APIs. As a result, I wrote a post on the subject:
    [A Brief History of API: RPC, REST, GraphQL, tRPC](https://dev.to/zenstack/a-brief-history-of-api-rpc-rest-graphql-trpc-fme).
    The post received 28k views and by far the most reactions (376) out of all my posts

I attended another Node.js event where I arrived early even though I knew people generally don't come on time for such events.

Since there weren't many attendees present, Thomas, one of the organizers, had a conversation with me. When he heard that I’m working on ZenStack, instead of giving me any feedback, he directly asked “would you like to give a talk about ZenStack after the main speaker?” Despite being surprised, I agreed and gave my first public talk about ZenStack:

![lighting-talk](https://user-images.githubusercontent.com/16688722/222949794-faa37023-cbd4-48e8-96a4-b91d46d8c9ed.png)

On that day, the number of visitors to the ZenStack website reached its peak. Despite being unprepared for the public talk, speaking about ZenStack led to some new ideas that came to mind. These ideas were later summarized and turned into a new post:

[From FullStack to ZenStack](https://dev.to/zenstack/from-fullstack-to-zenstack-3f21)

So far, it is the content that attracts the most users to ZenStack website.

### Solve the existing issues of other open-source projects

Even though your project may not have gained sufficient recognition, there are other well-known projects that have. And Usually the more popular, the more open issues in GitHub. By offering a solution to one of these issues, you can post your project there and increase its visibility. Those who are keeping an eye on the issue may take notice of your project and take a look at what you're building.

In order to test this hypothesis at a low cost, I began by writing a post that listed the most popular open issues in Prisma.

[What Prisma doesn’t have yet](https://dev.to/zenstack/what-prisma-doesnt-have-yet-pan)

hoping to gauge user reactions and decide which issues to prioritize. However, the post did not receive many reactions 😂.  As mentioned above, it’s a common case. So we decided to tackle the issues one by one instead.

After posting for the custom attribute issue below:

[![Custom attribute issue](https://user-images.githubusercontent.com/16688722/222951181-e4f71caa-a669-46c6-ae63-101be0bc0aa6.png)](https://github.com/prisma/prisma/issues/3102#issuecomment-1425690105)

We attracted a very special watcher for that issue, Nikolas, the developer advocate at Prisma. He then elaborated a great tweet for us, which once again brought another peak in website visitors for ZenStack.

[![Nikolas Burk on Twitter](https://user-images.githubusercontent.com/16688722/222950593-37dc003b-e452-48ec-a77a-20f61fa6612b.png)](https://twitter.com/nikolasburk/status/1625066262555504641)

After posting for another soft delete issue, I got invited to speak about ZenStack in “what’s new in Prisma”, the official Prisma live stream:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/-Q5vV6s4jIU?start=2205" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Once again, a peek time and is still going up. 😄

## Bnous

ZenStack could also generate the tRPC route, which is based on the awesome work of [Omar Dulaimi](https://github.com/omar-dulaimi/prisma-trpc-generator). We showed our gratitude by buying some coffee for him. he gave us a star later. One of his followers noticed it and decided to check out ZenStack. The first thing he said in our Discord was:

> Zenstack seems like a dream come true

After talking with him, we found out that he is the perfect match for our ideal user portrait. And he reported 3 bugs we might never be able to find by ourselves just on the first day. Isn't it incredible how a small action can create such a positive impact, much like the butterfly effect?😄

## Final word

**Keep doing the right things and wait for the good thing to happen. You will never guess what it is and how good it is.**
