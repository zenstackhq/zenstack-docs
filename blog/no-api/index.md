---
description: This post introduces how modern tools and frameworks help you derive web APIs without explicitly implementing them.
tags: [api]
authors: yiming
date: 2024-03-31
image: ./cover.png
---

# The Many Ways Not to Build an API

![Cover image](cover.png)

Building an API is one of the most important things one learns when getting into backend development. There are many good reasons why the entire industry pays so much attention to this topic - styles, transport, security, extensibility, documentation, testing, etc. A good set of APIs allow your application to work great not only through the UI, but also in headless mode, enabling endless integration opportunities for your users.

<!-- truncate -->

However, there are probably more good reasons that you shouldn't spend too much time on this topic. Especially when you're just starting out, your frontend is likely to be the only consumer of your API, and for most startup apps that situation can last for quite a while, if not forever.

In this post, let's explore some of the alternative ways of having APIs without explicitly building them.

## SSR Data Loader

If you've used some of the modern full-stack frameworks like Next.js, Remix, or Nuxt, you're probably familiar with how SSR should be implemented. Here's an example using Next.js (with the old pages router):

```tsx
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
 
type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps = (async () => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo: Repo = await res.json()
  return { props: { repo } }
}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

In such a page implementation, the backend and frontend code are colocated, and there's an implicit network boundary. What happens during the initial rendering is that the framework executes the data loader function (`getServerSideProps`) on the server side, fetches the data, and renders the page into HTML with the data. The data is also serialized into the HTML so that the client-side React runtime can "hydrate" and make the page interactive.

During a route transition, the data loader will solely behave as a JSON data API. The client-side code fetches it to get the data for rendering the new page.

If we understand API as something that serves data to the client, SSR data loaders are indeed APIs with an implicit contract and serving just one single page.

## React Server Component

SSR is helpful but it's coarse-grained at the page level. React Server Component (RSC) took a step further by pushing such implicit APIs to the component level. Here's an example using Next.js's app router:

```tsx
export function ServerComponent() {
    console.log('This will only be printed on the server');
    return (
        <div>
            <h1>Server Component</h1>
            <p>My secret key: {process.env.MY_SECRET_ENV}</p>
        </div>
    );
}
```

RSC is a complex topic with many detailed differences from SSR. For example its code is guaranteed to run only on the server side, and, as a consequence, it sends its rendering result to the client instead of JSON data. However, conceptually, it's also an implicit kind of API that serves data to the client. I find such a mental model easier to understand, too.

## Functions as API

I'm talking about RPC here. RPC is an ancient technology, almost as old as computer networking. If you had done any [DCOM](https://en.wikipedia.org/wiki/Distributed_Component_Object_Model) programming on Windows I bet you hate how awkward it was. 

Surprisingly, thanks to the power of TypeScript, new Node.js RPC frameworks like [tRPC](https://trpc.io) and [ts-rest](https://ts-rest.com/) now provide extremely pleasant and snappy developer experiences. 

Here's an example using tRPC:

```ts
// server code

const appRouter = router({
  user: {
    // list users
    list: publicProcedure.query(() => db.user.findMany()),

    // create a user
    create: publicProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => db.user.create(input))
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
```

```ts
// client code

// Initialize the tRPC client
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

const users = await trpc.user.list.query();
console.log('Users:', users);

const createdUser = await trpc.user.create.mutate({ name: 'trpc lover' });
console.log('Created user:', createdUser);
```

As you can see, the non-business-logic boilerplate has been reduced to a minimum. You just write functions. The entire RPC process happens transparently. And the TypeScript type system ensures that the client and server are always in sync.

## Database schema as API

As much as we feel ashamed to admit it, most web apps are CRUD apps. Simple as it may sound, many CRUD API implementations are bloated. I still remember my typical NestJS GraphQL APIs: a schema, a controller, a resolver, a DTO, a database repository, ... so much work for so little fun, and you can sense how much duplication there is.

A more sensible approach is to let the database schema drive the entire thing since CRUD is all about the database anyway. Mapping a database schema into a web API is not difficult, but the challenge is how to secure it. There are two different strategies to it.

If you use PostgreSQL and are proficient with using its row-level security feature, you can choose from several tools/services built above RLS, including [Supabase](https://supabase.com), [PostgREST](https://postgrest.org/), and [PostGraphile](https://www.graphile.org/postgraphile/). They all provide a way to expose database CRUD as a web API, assuming you've configured the RLS rules to properly secure the access.

Another strategy is to model access control declaratively and enforce it in the application layer. [ZenStack](https://zenstack.dev/)(built above Prisma ORM) and [Hasura](https://hasura.io/) are good examples of this approach. The following code shows how access policies are defined with ZenStack and how a secured CRUD API can be derived automatically.

```ts
model User {
    id Int @id() @default(autoincrement())
    email String @unique()
    posts Post[]

    // make user profile public
    @@allow('read', true)
}

model Post {
    id Int @id() @default(autoincrement())
    title String
    published Boolean @default(false)
    author User? @relation(fields: [authorId], references: [id])
    authorId Int?

    // author has full access
    @@allow('all', auth() == author)

    // logged-in users can view published posts
    @@allow('read', auth() != null && published)
}
```

```ts
// The following code shows how to serve an automatic CRUD API with Express.js

import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

// serve CRUD API at "/api/model"
app.use(
    '/api/model',
    ZenStackMiddleware({
        // getSessionUser extracts the current session user from the request, its
        // implementation depends on your auth solution
        getPrisma: (request) => enhance(prisma, { user: getSessionUser(request) }),
    })
);
```


## Conclusion

We are currently experiencing a boom in new tooling. The zeitgeist is straight-to-the-point, more streamlined, pleasant-to-write, and type-safety. The way we think about APIs and implement them is definitely at the center of this reform. I hope this post gives you a glimpse of the future, even if some of the ideas may seem too bold for now.