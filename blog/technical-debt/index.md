---
title: How to Build an Extensible System With Less Technical Debt From Day One
description: How technical debt happen and how to reduce it.
tags: [zenstack, design]
authors: jiasheng
date: 2023-04-30
image: ./cover.jpg
---

# How to Build an Extensible System With Less Technical Debt From Day One

![Cover Image](cover.jpg)

Have you ever built a product from scratch?  If so, I bet you definitely experienced the trade-off between the design quality and time to market.  In fact, you might have to struggle with it more than you expected.  In Shopify's practice [Deconstructing the Monolith: Designing Software that Maximizes Developer Productivity](https://www.shopify.com/uk/partners/blog/monolith-software), they get the conclusion below:

> In conclusion, no architecture is often the best architecture in the early days of a system. This isn’t to say don’t implement good software practices, but don’t spend weeks and months attempting to architect a complex system that you don’t yet know. Martin Fowler’s [Design Stamina Hypothesis](https://martinfowler.com/bliki/DesignStaminaHypothesis.html) does a great job of illustrating this idea, by explaining that in the early stages of most applications, you can move very quickly with little design. It’s practical to trade off design quality for time to market. Once the speed at which you can add features and functionality begins to slow down, that’s when it’s time to invest in good design.
> 

<!--truncate-->

![design](https://user-images.githubusercontent.com/16688722/235368634-8e509734-f858-430d-a59d-94a6ac85ca0d.png)

Martin Fowler’s Design Stamina Hypothesis does make a good illustration of this issue. But it raises the question of where the **design payoff line** is.  As Martin’s judgment call, it is usually much lower than most people think.  So the consequence of it is the famous [Technical Debt](https://martinfowler.com/bliki/TechnicalDebt.html) you need to pay.

## How does technical debt happen

Assuming we're building a SaaS development management tool, let's say we started with Bug management and it was a hit with customers. A big company then approached us, saying they'd adopt our product if we could provide Task management within a certain timeframe. Time is limited,  so we need to develop it ASAP. Here comes the seed of Technical debt:

### Code Duplication

It’s not surprising that developers choose to copy and paste the code from Bug management and modify it since it’s the quickest and easiest way to do so.  It leads to the consequence of code duplication, although you haven’t need to pay the debt yet. 

### Difficult to change

Our product gains huge success in the market, and we have added more features like OKR, Scrum, Dashboard, Workflow, etc.  Then we got the request from the customers that they need to have an admin account that has permission to read/write any resources in their company.  Here comes the debt you need to pay because it involves the code change that happens in every feature existing in your product.  It’s not only time-consuming but error-prone. 

### Steep learning curve

Another debt you also need to pay now is that it becomes harder for new developers to onboard.  Even trying to make seemingly simple changes requires a lot of context and knowledge like the above. Without this knowledge, new developers may unintentionally introduce errors or break existing functionality.

## How to reduce technical debt

The problem with technical debt is that it’s kind of inevitable.  Why? because no matter how much effort you put into the design in the early days,  you can’t guarantee it’s the best way to go because you can’t think through all the issues you need to deal with and you can’t foresee all the requirement changes in the future.   So what should we do to make it less?

Remember how technical debt grows from the beginning?  So my take is that at least we could focus on eliminating duplication, or Pragmatic Programmer’s DRY(Don't Repeat Yourself). 


The [ZenStack](https://zenstack.dev/) toolkit we are building is adhering to it. It uses the declarative data model on top of Prisma adding access policy and validation rules,  from which it will automatically generate APIs including OpenAPI, tPRC route, and hooks for you.  In the latest release, we add the abstract inheritance feature to further address it.  

Let's review the steps in the SaaS example mentioned earlier to see how each one is addressed.
You can represent this conceptually using the following model in the beginning:

```zmodel
/*
 * Model for a team space 
 */
model Space {
    id String @id @default(uuid())
    members SpaceUser[]
    bug Bug[]
    // require login
    @@deny('all', auth() == null)

    // everyone can create a space
    @@allow('create', true)

    // any user in the space can read the space
    @@allow('read', members?[owner == auth()])
}

/*
 * Model for a user
 */
model User {
    id String @id @default(uuid())
    password String? @password @omit
    name String?
    spaces SpaceUser[]
    bug Bug[]

    // can be created by anyone, even not logged in
    @@allow('create', true)

    // can be read by users sharing any space
    @@allow('read', spaces?[space.members?[owner == auth()]])

    // full access by oneself
    @@allow('all', auth() == this)
}

/*
* Base model for all models in a space
*/
abstract model SpaceBase {
    id String @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId String
    space Space @relation(fields: [spaceId], references: [id], onDelete: Cascade)
    spaceId String
    @@allow('read', owner == auth() || space.members?[owner == auth()] )
    @@allow('create', owner == auth() && space.members?[owner == auth()])
    @@allow('update', owner == auth() && space.members?[owner == auth()] && future().owner == owner)
    @@allow('delete', owner == auth())
}

/*
 * Model representing membership of a user in a space
 */
model SpaceUser extends SpaceBase {
    nickName String
}

/*
 * Model for a bug
 */
model Bug extends SpaceBase {
    title String
    priority Int
    ..
}
```

### Code Duplication

Pay attention to the `SpaceBase` model,  it has all the necessary fields and access policies to support **tenant isolation**.  When we need to add the Task feature, instead of copy paste the code of the Bug feature,  you just need to simply extend the `SpaceBase` model like the below:

```zmodel
/*
 * Model for a task
 */
model Task extends SpaceBase {
    title String
    size Int
}
```

Then the API for it will just be automatically generated for you.   There is no code duplication anymore. 

### Difficult to change

To support the admin role,  the change you need to make in the schema are below:

- add an enum `SpaceUserRole`
    
    ```zmodel
    /*
     * Enum for user's role in a space
     */
    enum SpaceUserRole {
        USER
        ADMIN
    }
    ```
    
- add role field in `SpaceUser`
    
    ```zmodel
    model SpaceUser extends SpaceBase {
        role SpaceUserRole
        ...
    }
    ```
    
- add the policy in `SpaceBase`
    
    ```zmodel
    abstract model SpaceBase {
        ...
        //allow admin user to do anything
        @@allow('all', space.members?[role == ADMIN])
    }
    ```
    

**You don't need to modify any lines of TS/JS code as ZenStack's access policy takes care of it all.**

### Steep learning curve

Now when the new developer onboard, he could easily get the whole picture by examining the schema files instead of diving deep into the codebase.   Moreover, he could start to add the new model by extending the `SpaceBase` with little worry to break anything. 

To be honest,  it is still required to add the opposite relation fields in the `User` and `Space` models when adding the new model.  The good news is that the intelligence of the ZenStack VSCode extension would handle it for you:

![vscode](https://user-images.githubusercontent.com/16688722/235368632-35462d24-c7af-4743-b1c0-96712172a94a.png)

Care to try it? visit our [website](https://zenstack.dev/) to see how to get started with it.