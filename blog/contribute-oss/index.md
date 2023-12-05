---
title: Contributing To Open Source Projects Might Be Easier Than You Think
description: Illustrate with a real case how open-source contributions go beyond code from maintainers perspective
tags: [open-source, oss, community, zenstack]
authors: jiasheng
date: 2023-12-05
image: ./cover.png
---

# Contributing To Open Source Projects Might Be Easier Than You Think

![Cover Image](cover.png)

As a software developer, you may not have directly participated in any open-source project, but you have likely benefited from the open-source world unless you don't use Git, GitHub, or Linux. 😄 In return, many of us would like to contribute and be a part of this new wave of collaborative and transparent development.
<!--truncate-->
However, many people have not taken their first step because the process of contributing can be intimidating.

- How to find a suitable issue to contribute?
- How to confirm with the maintainer that this is actually what they want?
- How to make sure my solution is the right way to go?
- Do I need to add some test cases or documentation?
- What if something goes wrong?

First of all, due to the nature of human beings, we tend to exaggerate difficulties before attempting a new task.  Even leave it alone,  here lies a common misconception about contributing to open-source projects: 

**You need to contribute code** 

While code contributions are undoubtedly valuable, they represent just one facet of the broader landscape of open-source collaboration.  There are other ways you might make an even greater contribution than code. 

## What It Means To Contribute

I wrote a post about implementing a high-concurrency ticket booking system leveraging on Optimistic Concurrency Control (OCC):

[How To Build a High-Concurrency Ticket Booking System With Prisma](https://dev.to/zenstack/how-to-build-a-high-concurrency-ticket-booking-system-with-prisma-184n)

Many people are impressed by the concise code by Prisma or ZenStack to achieve that:

```tsx
    await client.seat.update({
        data: {
            userId: userId,
            version: {
                increment: 1,
            },
        },
        where: {
            id: availableSeat.id,
        },
    });
```

What they might not know is that it’s not possible before Prisma 4.5.0 because of the below issue:
[Be able to update or retrieve a single record including non-unique fields in the "where" conditions](https://github.com/prisma/prisma/issues/7290)

Before that you have to use `updateMany` followed by the count check as below:

```tsx
const seats = await client.seat.updateMany({
  data: {
    claimedBy: userEmail,
    version: {
      increment: 1,
    },
  },
  where: {
    id: availableSeat.id,
    version: availableSeat.version, 
})

if (seats.count === 0) {
  throw new Error(`That seat is already booked! Please try again.`)
}
```

Although a little verbose, it works. However, before Prisma 4.4.0, it was unable to function due to the issue described below:

[updateMany() causes lost-updates](https://github.com/prisma/prisma/issues/8612)

The issue was filed when it was already listed as an example of Optimistic Concurrency Control (OCC) in the [official documentation of Prisma](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control) (which is still present today). Therefore, before it was fixed, the Prisma team had to temporarily add a warning to the documentation at that time.

![prisma-doc-fix](https://github.com/jiashengguo/Test/assets/16688722/19c0faef-5b4c-4517-86cc-1ec306167bf5)

After closely examining the threads of the two mentioned issues, I believe you would agree that Prisma team implemented the fix as a result of conversations and discussions among actively involved community members. If you are the maintainer of Prisma, would you consider these people as contributors? Regardless of your opinion, GitHub will do:

>[Issues, pull requests and discussions](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile#issues-pull-requests-and-discussions)
>Issues, pull requests, and discussions will appear on your contribution graph if they were opened in a standalone repository, not a fork.

## Feedback Might Be More Valuable Than PR

I recently listened to a talk by Tanner Linsley, the creator of [TanStack](https://tanstack.com/) (React Query), about his personal experience in the open-source community. I highly recommend listening to it:

[Open Source Hour with Tanner Linsley](https://twitter.com/i/spaces/1yoJMwdVWpoKQ)

During the interview, the hoster asked him a question:

> What types of contributions do you find most valuable for your projects

Here is the simplified version of his answer:

> The most valuable contributions are at kind of the leaf node level. It’s the gentle feedback of 
- I tried following the documnetaion or I tired doing this and it didn’t work
- I got confused or I’m stuck
It may not be feedback that makes it all the way out of the library. 

> And once in a while, you will get people who go above and beyond and propose something, either a documentation change itself or maybe an API change. I feel like it's an exponential falloff. There are so many people who are willing to offer their two cents on, it didn't work. Most people beyond that aren't going to help you out; they are just going to kind of dine and dash. 

> Only one percent of those people are going to open a PR. Those are great, but usually, they require guidance from the core maintainers to say: "We would love to do that, but we can't do it that way because of XYZ." And I feel like less than 10 percent of those people will stick to the PR. Those are the people you need to nurture and pay attention to.

> **contributions come in many forms.** 


## Open Source Contributions Go Beyond Code

Open source projects are more than just code. They provide a collaborative space where people can report problems, ask questions, and suggest fixes or improvements, among other things. So, if you notice anything wrong or feel that something could be better or different in the project you already use or want to use, don't hesitate to let the community hear your voice.

[ZenStack](https://github.com/zenstackhq/zenstack) is an open-source toolkit that we are developing on top of Prisma ORM. It provides an innovative schema-first approach for building web applications. If you feel that it could be helpful for you, simply trying it out and letting us know your thoughts would be a great contribution to us!