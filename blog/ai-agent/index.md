---
title: How to Build AI Agents to Enhance  SaaS With Minimal Code and Effort?
description: A thought experiment on the roles AI can play in software development.
tags: [ai, saas]
authors: jiasheng
date: 2025-05-19
image: ./cover.png
---

# How to Build AI Agents to Enhance SaaS With Minimal Code and Effort?

![Cover Image](cover.png)

## Is SaaS Really Dead?

Several months ago,  the internet was abuzz with the Microsoft CEO Satya Nadella saying, “SaaS is dead.”   

The conversation started with a question from Bill Gurley about whether Satya was worried that newer startups are building applications with an AI-first approach, which could obfuscate traditional infrastructure like Excel or CRM.  Here is Satya’s response:

<!--truncate-->

> I think, ****the notion that business applications exist, that’s probably where they’ll all collapse, right in the agent era**,** because if you think about it, right, **they are essentially CRUD databases with a bunch of business logic.**The business logic is all going to these agents, and these agents are going to be multi repo CRUD
> 

Some people might assume he suggested that AI agents could or would replace SaaS. However, if you watch the entire podcast, you'll understand that he's actually discussing how AI agents will transform SaaS rather than replace it: 

<iframe width="560" height="315" src="https://www.youtube.com/watch?v=9NtsnzRFJ_o&t=2770s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


How? Let me share an example from my experience. At my previous company, we used Trello for project management. I was impressed by its clean and efficient UX design. 

![trello](https://github.com/user-attachments/assets/53a04803-25c6-485f-b0de-37d0b61c6168)

However, one drawback that consistently bothered me was the lack of flexibility in performing queries.  For instance:

- How many cards were done last week?
- Who has the most incomplete cards?
- Which list has the most incomplete cards?

Trello doesn't provide a direct way to show the answer; you'll need to do the math manually.  I understand that offering such flexibility from a UI design perspective is challenging,  yet each encounter often brings a sigh of frustration. 😮‍💨

Balancing flexibility and simplicity is a core challenge for SaaS. This is where an AI agent can play a role. The most straightforward solution is to introduce a chatbot that can easily provide answers to all the questions mentioned, without altering any existing features.

## Challenge of Building an AI Chatbot

We are all aware of the hallucinations that AI causes.  But there is another level of hallucination: 

AI makes many things seem easily accomplished on the surface, but you will see the challenge under the iceberg when it comes to production. 

My previous company tried to integrate a chat agent into their SaaS product, and was struggling with those challenges:

1. **LLM Failed to Generate the Correct API Call**
    
    The initial plan was to have the LLM generate an API call directly based on user input. However, probably because the existing API is not well designed,  LLM often struggles to interpret and generate the correct parameters. Sometimes, it even calls the wrong API.
    
2. **The Complexity of Transforming the LLM Result**
    
    Since the initial plan fails, they ask LLM to create the intermediate structured query object, then use code to convert this object into an actual database query.  The good thing is that it is the code that makes the final call; the bad thing is that the code can become highly complex as it needs to account for all possible cases the LLM might produce.
    
    One critical issue that needs to be addressed is authorization. You have to scrutinize and ensure the generated query doesn’t break the authorization rule of the current system, which can sometimes be quite complex. Any oversight could lead to significant security breaches, potentially disastrous for a B2B SaaS.
    

The fundamental issue seems to be that the current infrastructure is not friendly enough for AI agents, as Bill questioned Satya. So, what type of infrastructure would be suitable for AI?

## **Schema-First Fit AI-First**

Among all the discussions regarding Satya’s statement:

*They are essentially CRUD databases with a bunch of business logic**.** The business logic is all going to these agents.*

Many people focus solely on the business logic that will be handled by the agent, often neglecting the essential prerequisite: **the CRUD database**. In other words, AI must accurately and precisely translate the business logic to the CRUD operation to ensure success. This is where the challenges arise, as illustrated in the previous example.  It seems there is a missing layer that focuses on 'what' rather than 'how' to make AI better work: **a schema**.  AI excels at declarative schemas over imperative code.   Therefore, if we could make the CRUD database a well-designed schema for AI to manipulate,  that could provide a robust foundation for the mission to be done. 

The ZenStack schema-first toolkit is well-suited for the task. The core part is a DSL that unifies data modeling and access control, two essential parts of CRUD databases.  Here is an example of what a simple blog post looks like:

```jsx
enum Role {
    USER
    ADMIN
}

model Post {
    id        String  @id @default(cuid())
    title     String
    published Boolean @default(false)
    author    User    @relation(fields: [authorId], references: [id])
    authorId  String  @default(auth().id)

    @@allow('all', auth() == author)
    @@allow('read', auth() != null && published )
    @@allow('read', auth().role == 'ADMIN')
}

model User {
    id       String  @id @default(cuid())
    email    String? @unique
    password String  @password @omit
    role     Role    @default(USER)
    posts    Post[]

    @@allow('create,read', true)
    @@allow('update,delete', auth() == this)
}
```

Based on the schema, ZenStack automatically generates well-structured, type-safe, and authorized CRUD APIs to the database.  Not only can AI understand and manipulate it better with less chance of hallucination, but also developers will be able to build the AI agent on top of it easily.   

I know talk is cheap, so let me show you the code!

# Building an AI Chatbot from Scratch

Let’s build an AI chatbot for a Todo app to address the pain points of Trello earlier. To keep this concise, I'll focus on the key steps. You can find the link to the completed project on GitHub at the end of the post.  Here is the final outcome:

![zenstack-ai-chatbot](https://github.com/user-attachments/assets/4dce1624-2d8e-464a-bf92-bdfed461e424)

### Stacks

- [Next.js](https://nextjs.org/) - React framework
- [ZenStack](https://zenstack.dev/) - Full-stack toolkit with access control
- [NextAuth](https://next-auth.js.org/) - Authentication for Next.js
- [AI SDK](https://sdk.vercel.ai/) - AI integration for chat features

### 1. Creating the project

Create a Next.js project with `create-t3-app` with Prisma, NextAuth, and TailwindCSS:

```jsx
npx create-t3-app@latest --prisma --nextAuth --tailwind --appRouter --CI todo-ai
```

### 2. Initialize the project for ZenStack

Run the `zenstack` CLI to prepare your project for using ZenStack.

```jsx
npx zenstack@latest init
```

Replace the `schema.zmodel` with the below content:

```jsx
generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
}

plugin zod {
    provider = '@core/zod'
}

/*
 * Model for a Todo list
 */
model List {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId   String   @default(auth().id)
    title     String   @length(1, 100)
    private   Boolean  @default(false)
    todos     Todo[]
    // can be read by owner or space members (only if not private) 
    @@allow('read', !private)

    // owner can do anything
    @@allow('all', owner == auth())
}

/*
 * Model for a single Todo
 */
model Todo {
    id          String    @id @default(uuid())
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    owner       User      @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId     String    @default(auth().id)
    list        List      @relation(fields: [listId], references: [id], onDelete: Cascade)
    listId      String
    title       String    @length(1, 100)
    completedAt DateTime?

    // full access if the parent list is readable
    @@allow('all', check(list, 'read'))
}

model User {
    id       String  @id @default(cuid())
    name     String?
    email    String? @unique
    password String  @password @omit
    todo     Todo[]
    list     List[]

    // everyone can signup, and user profile is also publicly readable
    @@allow('create,read', true)
    // only the user can update or delete their own profile
    @@allow('update,delete', auth() == this)
}
```

This represents a multi-user Todo app.  Todo list can be private or public; list owners have full control over their list.  If a user can see the list, they can manipulate all the todos under that list.  

### 3.  Implement Signup/Signin

The tasks here are configuring `NextAuth` to use credential-based auth and creating the signup/signin form.  Check out the code for details.

### 4. Implement the chatbot logic with Vercel AI SDK and ZenStack

We will primarily utilize the AI SDK to develop the chatbot. It not only standardizes integration across various LLM providers but also offers a range of hooks for creating chat and generative user interfaces.   With that, building a chatbot with real-time message streaming requires just a few lines of code.  Here is the official doc for it:

[Chatbot](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)

Simply put,  it provides a `userChat` hook for the client and a corresponding server endpoint in `src/app/chat/route.ts`.  I will skip the UI part and focus on implementing the endpoint, which is essentially the complete functionality of this bot.

Every AI agent typically consists of two components: **Tools and Prompts**. As previously discussed, **Tools** in this context refer to the CRUD APIs of the database. So let’s see how it is getting implemented. 

The AI SDK allows Zod Schema to be used to define the parameters of the Tool.  So, have you noticed a Zod plugin defined in the `schema.zmodel`?

```tsx
plugin zod {
    provider = '@core/zod'
}
```

This is a ZenStack native plugin that generates Zod schemas for models and input arguments of Prisma CRUD operations.   For instance, it will generate the CRUD schema for every model as below:

```tsx
declare type TodoInputSchemaType = {
    findUnique: z.ZodType<Prisma.TodoFindUniqueArgs>;
    findFirst: z.ZodType<Prisma.TodoFindFirstArgs>;
    findMany: z.ZodType<Prisma.TodoFindManyArgs>;
    create: z.ZodType<Prisma.TodoCreateArgs>;
    createMany: z.ZodType<Prisma.TodoCreateManyArgs>;
    delete: z.ZodType<Prisma.TodoDeleteArgs>;
    deleteMany: z.ZodType<Prisma.TodoDeleteManyArgs>;
    update: z.ZodType<Prisma.TodoUpdateArgs>;
    updateMany: z.ZodType<Prisma.TodoUpdateManyArgs>;
    upsert: z.ZodType<Prisma.TodoUpsertArgs>;
    aggregate: z.ZodType<Prisma.TodoAggregateArgs>;
    groupBy: z.ZodType<Prisma.TodoGroupByArgs>;
    count: z.ZodType<Prisma.TodoCountArgs>;
};
```

Therefore, all we need to do is convert each CRUD operation to an AI SDK `tool`.  Let’s create a `createToolsFromZodSchema` function iterates all the models:

```tsx
import prismaInputSchema from "@zenstackhq/runtime/zod/input";
import { type Tool, tool, zodSchema } from "ai";

async function createToolsFromZodSchema(prisma: PrismaClient) {
  const tools: Record<string, Tool> = {};
  const functionNames = ["findMany", "createMany", "deleteMany", "updateMany"];
  for (const [inputTypeName, functions] of Object.entries(prismaInputSchema)) {
    // remove the postfix InputSchema from the model name
    const modelName = inputTypeName.replace("InputSchema", "");
    for (const [functionName, functionSchema] of Object.entries(
      functions,
    ).filter((x) => functionNames.includes(x[0]))) {
      const functionParameterType = zodSchema(
        functionSchema as z.ZodObject<z.ZodRawShape>,
        {
          useReferences: true,
        },
      );
      tools[`${modelName}_${functionName}`] = tool({
        description: `Prisma client API '${functionName}' function input argument for model '${modelName}'`,
        parameters: functionParameterType,
        execute: async (input: unknown) => {
          console.log(
            `Executing ${modelName}.${functionName} with input:`,
            JSON.stringify(input),
          );
          // eslint-disable-next-line
          return (prisma as any)[modelName][functionName](input);
        },
      });
    }
  }
```

<aside>
💡

To minimize the tool count and alleviate the AI's workload, we offer only four fundamental operations: "findMany," "createMany," "deleteMany," and "updateMany.”

</aside>

The `execute` function inside is quite simple, just invoke the corresponding prisma client API function using the passed in `PrismaClient` object.  Here comes the most crucial part,  which is also the most exciting part of ZenStack:

The `PriamClient` object should be the `enhanced` Prisma client that contains the current user identity instead of the regular Prisma client:

```tsx
export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const authObj = await auth();
  const enhancedPrisma = enhance(db, { user: authObj?.user });
  const tools = await createToolsFromZodSchema(enhancedPrisma);
  ...
}
```

**The benefit is that no matter what parameters  AI generates for a function,  you never have to worry about unauthorized access.  This is because the access policy defined in the schema will always be injected under the hood before reaching the database.**   

The system prompt is straightforward and general; you can review the code and tailor it to suit your specific requirements.

Thanks to the AI SDK and ZenStack, the entire server implementation of this chatbot was completed in less than 100 lines of code!   Even more impressive, this implementation is completely app-agnostic. In other words, regardless of your app (zmodel), it works seamlessly.  

So if you're a ZenStack user, you now know the best practice for implementing an AI Chatbot. 😉

## Try It for Your Own Application

Here is the final project that you can run directly:

[https://github.com/jiashengguo/zenstack-ai-chatbot](https://github.com/jiashengguo/zenstack-ai-chatbot)

The benefit is that you can easily test this AI chat agent for your own application — all you need to do is customize `schema.zmodel` to fit your application.  I would love to hear your feedback on it