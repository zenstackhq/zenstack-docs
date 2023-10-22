---
title: 'How to make good DX(Developer Experience): Empathize'
description: Why DX matters and how to create great DX toolkit for developers.
tags: [DX, zensatck]
authors: jiasheng
date: 2023-03-24
image: ./cover.png
---

# How to make good DX(Developer Experience): Empathize

![Cover Image](cover.png)

## Our Story

My co-founder and I are building the full-stack toolkit [ZenStack](https://zenstack.dev) on top of Prisma. One major feature is allowing define access policies declaratively in the schema. It started with Him reporting an issue for that:

<!--truncate-->

-   He: There is a scenario user can’t express for now. Let’s say a user is building a pet store, the pet could only be added to an order if it has not been added to any order yet. The policy he needs to write in `Order` model should be as below:

    ```zmodel
    model Order
    {
      pets Pet[]

      // The user could only create an order if all the pets in the order have not been added to any order yet.
      @@allow('create', !pets?[orderId != null])
    }
    ```

    But it couldn’t work for now. 😒

-   **Me: Wait a minute. We could support it, he just needs to define it in `Pet` model like the below:**

    ```zmodel
    model Pet
    {
      orderId String
      order Order @relation(fields: [orderId], references: [id])

      // The pet could only be added to an order if it has not been added to any order yet.
      @@allow('update', orderId == null || future().orderId == orderId)
    }
    ```

    **We are all good. 😉**

-   He: But it doesn't work in the example I wrote above 😞

-   **Me: But we could tell user to write it in my way. 😳**

-   He: But you can’t stop user to write in that way. 😂

I didn’t feel there is anything wrong until then.

## Why DX matters now

### User Experience

One of the most important breakthroughs in software over the last 15 years was the arrival of design thinking around user experience, the now-obvious idea that when average people pick up a new computer or use a new app they should quickly understand how it works.

-   Slack

    before Slack, many teams relied on email or instant messaging services like Skype or Google Hangouts to communicate. These platforms were clunky and lacked the user-friendly features that Slack provides, such as custom emojis and integrations with other apps.

-   Airtable

    before Airtable, many teams used spreadsheets like Excel to organize data. While Excel is a powerful tool, it is usually taken as a negative example of user experience. It usually takes a huge amount of time to learn how to use it, which could simply be justified by looking at how many courses that in the market. Instead, Airtable's customizable and intuitive UX makes it easy for users to organize and manipulate data, even if they have no prior experience with spreadsheets.

-   Notion

    Notion also stands out when compared to traditional note-taking and project management tools. Before Notion, users had to rely on separate apps for each function, leading to a fragmented workflow. Notion's UX provides a seamless and customizable workspace where users can combine all their productivity tools in one place.

### Developer Experience

For a long time, the focus has been solely on the end-user experience of the software. However, it turns out software developers are end-users, too. And people finally recognize the simple causality: **it is the developers who create the product.**

When developers have a positive experience building a product, they are more likely to produce high-quality code, meet deadlines, and collaborate better with their colleagues. This, in turn, leads to a better user experience for the end users.

When a company provides a better DX, it could stay competitive for talent attraction and retention.

That explains why in recent years, there has been a growing trend toward investing in DX toolkits. Perhaps the most notable example of this trend is [Vercel](https://vercel.com/), which has raised more than $300M by offering a powerful combination of an open-source tool Next.js and a platform that streamlines the process of building and deploying web applications.

## How to make good DX

So if you are building the developer toolkit, you probably would ask:

> What’s the most important thing to do to make a good DX?

My answer is simple:

> Empathize with the developer

As engineers, we often prioritize the technical aspects of our work and pay less attention to the human experience. This tendency isn't limited to less experienced engineers—it affects even top leaders like Bill Gates.

During an interview for the Netflix documentary [Inside Bill's Brain: Decoding Bill Gates](https://www.netflix.com/gb/title/80184771), Melinda Gates spoke about Bill's efforts to create an innovative toilet that would not contaminate clean water in developing countries.

> Bill has amazing scientists and innovative ideas for getting new toilet technology to absolutely change the developing world. But they can’t think about the experience of a mom who takes her child to the toilet. The moms tell me if men can see over the wall, I’m not going in there. It’s not safe and it’s not private. If I can’t take my child into the little stall with me, it doesn’t work. I can’t leave the child outside. That’s where I’m willing to be a little bit of grist with Bill. I will poke him a little bit.

So you either find your Melinda to poke you or you are going to do it by yourself. 😄

It sounds easy but how to do it? There are two takeaways in the book [Don’t make me think](https://sensible.com/dont-make-me-think/) I found it very helpful to remind me to empathize.

### We don’t make optimal choices. We satisfice.

There is a common assumption that developers excel at carefully weighing all options and selecting the optimal one. However, this is not always the case, especially when working with new tools or technologies. In these cases, they tend to opt for the first reasonable solution that presents itself, a strategy known as satisficing.

Why? Because our brains are usually in a hurry. Optimizing is hard, it cost more energy. So if we find something that works- no matter how badly- we tend to not look for a better way until we get stumbled.

During one customer interview for a data dashboard SaaS we built below:

![datadeck](https://user-images.githubusercontent.com/16688722/227601364-c433d64f-1392-4ff0-8946-72d40577d497.png)

One customer requested a feature:

-   Customer: Can you remember the folder expanding status? There are some dashboards in a very deep level of the folder. It’s tedious to expand it every time. 😒
-   **Me: Ok, I will add it to our backlog. But before that, why don’t you add it as Favorites so that you can directly see it in the Favorites tab? 🤔**
-   Customer: I forgot there was a Favorites. 😂

It’s already lucky that the customer is still willing to ask you for the solution. Remember every stumble is a minus for the confidence customer has in you. Continual stumbling could lead the customer to abandon your services in favor of other options. This is especially true in today's market where there are many emerging competitors to choose from.

### We don’t figure out how things work. We muddle through.

As the developers building the toolkit, we possess a complete understanding of how it operates. However, we may overlook the fact that the customer does not share the same level of familiarity with the toolkit. They may have only encountered a simple post or video highlighting a particular feature or benefit of the toolkit. It is unreasonable to expect them to read extensive documentation or examine the source code before utilizing it.

You could easily get it by asking yourself:

> How much time do you spend reading the document or source code before you start to write code about it?

For most of us, it doesn’t matter to us whether we understand how things work, as long as we get things done that way.

What we can do is follow Einstein’s suggestion:

> Make everything as simple as possible, but not simpler

Therefore, people could “get it” easily. Simultaneously, we need to ensure there are readily available resources for users to reference in case they encounter any problems or issues.

## Last Takeaway

To truly understand and empathize with developers, the most efficient approach is to communicate with them directly. Therefore, if you want to assist [ZenStack](https://zenstack.dev) in creating the most optimal DX for developing web applications, why not engage with us in [GitHub](https://github.com/zenstackhq/zenstack) or [Discord](https://go.zenstack.dev/chat)?
