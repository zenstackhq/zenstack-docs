---
title: What will happen to the full-stack framework in the future?
description: Illustrate some features of the full-stack framework that would evolve in the future
tags: [webdev, zenstack, fullstack, AI]
authors: jiasheng
date: 2023-12-21
image: ./cover.jpeg
---

# What will happen to the full-stack framework in the future?

![Cover Image](cover.jpeg)

## ~~Don't~~ Reinvent the Wheel

As software developers, we are all familiar with the phrase "Don't reinvent the wheel". However, I have heard many complaints that the Javascript world seems to do the exact opposite. 😂
<!--truncate-->
From the positive side of the coin, there are always abundant choices at almost every level from the bottom up: 

- Runtime: Node.js, Deno, Bun
- Package Manager: Npm, Pnpm, Yarn
- Bundler: Webpack, Rollup, Parcel, Vite, Turbopack
- UI Framework: React, Vue, Svelte, Angular
- FullStack framework: Next.js, Remix, Nuxt, Sveltekit

![JavaScript-ecosystem](https://github.com/zenstackhq/zenstack/assets/16688722/90258209-5e61-47c7-8dc8-1e5b86e5e935)

The negative side is that developers, especially those with less experience, may feel overwhelmed and caught in the crossfire of choices.  The recent debate between Remix and Next.js camps could well illustrate that: 

[Why I Won't Use Next.js](https://www.epicweb.dev/why-i-wont-use-nextjs)

[Why I'm Using Next.js](https://leerob.io/blog/using-nextjs)

Although there are quite a few **opinionated** battery-included frameworks that have picked up everything for you like [RedwoodJS](https://redwoodjs.com/), [Blitz](https://blitzjs.com/), and [Create-T3-App](https://create.t3.gg/),  you still need to choose between them and hope that they will remain mainstream and well-maintained in the future.  So how should we choose?

In "The 7 Habits of Highly Effective People," the habit that resonates most with me is the second one: 

**Begin With the End in Mind**

When we find ourselves lacking a clear vision in the present, one effective strategy is to envision what the framework could potentially evolve into in the future.

## Features of the Future Framework

### Abstraction of the Data Layer

Bezos has a famous quote about the success of Amazon: 

> So people today want fast shipping. And they’re going to want faster and faster shipping in 10 years… so that’s going to matter today and tomorrow.

It means focusing on things that don’t change.  While technologies and methodologies continuously shift and evolve, the fundamental need to store, manage, and retrieve data consistently persists.  So you still need to have at least a database to achieve so.  

Even now, fewer full-stack developers are willing to directly talk with databases through the complexities of SQL queries and database schema management, let alone the ones that come from the front-end world.  Therefore ORM has already been the standard kit for the existing framework.  For instance, all three frameworks mentioned above have adopted [Prisma ORM](https://www.prisma.io/).

Furthermore, when it comes to scaling an application, it's common to think about the complexity of the code. However, in reality, the underlying data layer is often the root cause of scaling issues. If the data layer is tightly coupled with the application code, and as the application grows, the relationships between data entities become increasingly complex and difficult to manage. This challenge is even more pronounced in a full-stack environment where the frontend and backend are tightly coupled. Therefore, the abstraction layer that ORM provides ensures consistency across different layers of the application and facilitates efficient communication between the frontend and backend.

### Write Less Code and Utilize Code Generation

Writing less code not only saves time and energy from developers but also makes the application better to scale and maintain:

> a hundred lines of code is easier to scale than a thousand lines of code

That's exactly the job of the framework to handle more things that used to be implemented by ourselves like Routing, Data Fetching, Rendering Error Handling, etc. 

"**Writing less boilerplate code**" has become the slogan for almost every framework.  They usually provide the scaffold CLI to generate all kinds of stuff for you, including those that were previously considered essential like API. 

Since the ORM has defined the data models, which include the data types, relationships, and constraints,  it could automatically generate meaningful APIs from it.  It allows developers to gain more bandwidth to concentrate on the business logic instead of dedicating manual API implementation.  

For example, RedwoodJS generates the GraphQL API using the types generated from Prisma. If you are using [ZenStack](https://zenstack.dev/?utm_campaign=devto&utm_medium=organic&utm_content=future-fullstack), which is built on top of Prisma, it can generate both RESTful-style and RPC-style APIs with Swagger documentation or tRPC routers.

### More Declarative for AI

Austrian economist [Joseph Schumpeter](https://www.investopedia.com/terms/j/joseph-schumpeter.asp) is most known for coining the phrase "**creative destruction**" which describes the process that sees new innovations replacing existing ones that are rendered obsolete over time. The analogy could be: 

> no matter how much improvement is made to a wagon, it can never become a car.

Since we are discussing the next generation of the framework, we would like to see some innovations that can significantly improve productivity, similar to the leap from a wagon to a car.

What is the strong force that could make this happen? Take a look at the list of the new YC batch W24, and you will find out 😄

[The YC Startup Directory | Y Combinator](https://www.ycombinator.com/companies?batch=W24)

Yes, definitely AI. I think the more declarative the framework could be, the better AI could understand the application and help to manipulate it as much as possible.   The reason is that the declarative approach is a paradigm where you write code by describing **WHAT** you want to do rather than **HOW**.  That’s exactly what we are talking to ChatGPT every day.   

You can find the POC from the declarative framework [Wasp](https://wasp-lang.dev/):

[MAGE GPT Web App Generator ✨ MageGPT](https://usemage.ai/)

---

Of course, these are just some aspects I think are important. I would love to hear your thoughts or any opposing viewpoints. Please feel free to leave comments or reach out to me on Twitter!