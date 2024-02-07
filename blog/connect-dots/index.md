---
title: What Are the Chances of You Creating a Programming Language?
description: Enjoy whatever you are doing and wait for the dots to connect
tags: [compiler, language, DSL]
authors: jiasheng
date: 2024-02-07
image: ./cover.png
---

# What Are the Chances of You Creating a Programming Language?
![Cover Image](cover.png)

If I asked what’s your favorite  words of Steve Jobs, I believe most people would say:

> Stay Hungry. Stay Foolish

It’s coming from the 3rd story of the speech he gave at Stanford.  But my favorite one is coming from the first story:

> Connecting the Dots

<!--truncate-->
# Would You Ever Create a New Language?

Does the below content look familiar to you?

![compiler-content](https://github.com/zenstackhq/zenstack/assets/16688722/7881350c-d579-4c2a-b7fa-d2768a4ca15a)

If you have studied computer science before, it should be. This is the content from the classic [Dragon Book](https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools): 

![compiler-book-cover](https://github.com/zenstackhq/zenstack/assets/16688722/c0f57cd9-b0ad-4388-a7c3-8f7a94ac688f)

Even if your school adopted a different textbook for the Compiler Principles course, the concept of DFA is a cornerstone that you can't forget. Or does it? 😄

If this course were not compulsory for our major, I doubt how many students would choose to take it. Not only is it challenging to learn, but also from a pragmatic perspective:

> What are the chances of us creating a new programming language in the workplace?

Therefore, the motivation for many students is just to pass the exam and to get the credit. Some of them ended up getting a good score on the final exam due to the excessive practice of manual deduction of the regular expression, NFA, DFA, BNF, etc.  However, few of them are acutally interested in how a programming language is constructed from the ground.  

I also had that doubt too. But for me, it was the first time I ever felt the **science** part of my major.  To be honest, I never expected to have the opportunity to create a language either. However, somehow it did attract me to learn it rather than pass it. Perhaps it's because I feel relieved to understand the principles behind the tools I'll likely use throughout my career.

With hindsight, now I would say:

# You Never Know What Would Happen

During my last year of graduate school, I was lucky to get an internship at Microsoft.  The even more lucky part is that the team I joined was building a new DSL(Domain Specific Language) for protocol.  

Initially, I worked on an output adapter that generates documents from the parsed Abstract Syntax Tree (AST).  After a while, my leader assigned me a new task to investigate the possibility of rewriting the current LR parser with a new Recursive-Descent parser. I guess that due to my previous devotion to Compiler Principles, it didn't take as much time as they had expected for me to obtain the result.  

I still remember the day when the architect of my team reviewed my prototype with me one-on-one. In general, he affirmed my approach and provided some guidance and suggestions.  Although it's just him and me because all the other team members are going off-site, it was by far the best moment in my internship. 

I thought the job was done for me, the next step would be assigning a full-time employee to write the production code.  To my surprise,  I’m the one who put it into the production.  I assume that’s the main reason why I finally got the offer to join Microsoft. 

# I Would Never Write Front-End Code

As a backend developer with over 10 years of experience, I never imagined that I would write any front-end code. This is not only because front-end and back-end development require different skill sets but also because I believe that having a good sense of visual aesthetics is a crucial quality for front-end developers, which I lack.   However, there is a significant shortage of developer resources for the new SaaS product we were building in my previous company. As a result, I had to write front-end code. 

Although the view still stands that I would never be a good front-end developer, it is that experience that opened the door to full-stack development for me. I could see the knowledge gap between front-end and back-end developers, which makes it inefficient to deliver features end-to-end for complex web apps. 

# The Dots Are Connected

If you investigate some successful software, you will notice that many of them are created due to the pain point of the creator himself. The underlying logic this is easy to understand: 

**you need to be the customer of your own product to make it right**

The reason why we created ZenStack is the same because of the experience above.  We have felt many pain points that significantly slowed down product delivery from end-to-end during that time.  Therefore, it gave us a strong motivation to explore tooling & infrastructure space and find ways to improve efficiency. 

The DSL experience comes naturally to us as we have witnessed how well-designed language can greatly simplify programming tasks.  We know it is challenging but not as difficult as many may feel. Therefore, we chose the schema-first design to create [ZenStack](https://zenstack.dev/) toolkit on top of [Prisma ORM](https://www.prisma.io/) that leverages code generation to significantly reduce the code developers need to write and make them move a lot faster.

Check out the details of how we build it:

[How Much Work Does It Take to Build a Programming Language? | ZenStack](https://zenstack.dev/blog/build-language)

# Allow It and Make the Magic Happen

Despite ZenStack being relatively young, it has already integrated with various types of stacks:

![ZenStack-cover](https://github.com/zenstackhq/zenstack/assets/16688722/b2df2e5e-cdb1-4753-b144-04c3b85dfcb4)

Sometimes we were questioned if we were a little unfocused.  The short answer to that is that we haven’t figured out it clearly, so we have to give it a try.   

Here, I would like to use Steve Jobs’s words to answer it:

> Again, you can’t connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future. You have to trust in something — your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life.