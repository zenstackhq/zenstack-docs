---
sidebar_label: 2. Server Adapters
---

# Server Adapters

### Overview

ZenStack is a toolkit but not a framework. It doesn't come with its own web server. Instead, it provides a set of server adapters that "mount" APIs to the server of your choice.

Server adapters are framework-specific. ZenStack provides a `@zenstackhq/server` package that contains adapters for the most popular backend and full-stack frameworks:

- [Express](/docs/reference/server-adapters/express)
- [Fastify](/docs/reference/server-adapters/fastify)
- [Next.js](/docs/reference/server-adapters/next)
- [Nuxt](/docs/reference/server-adapters/nuxt)
- [SvelteKit](/docs/reference/server-adapters/sveltekit)
  
Check out their respective documentation to learn more details.

As mentioned in the previous chapter, server adapters are responsible for handling framework-specific request/response formats and transforming them to the canonical format that the underlying API handlers understand. All server adapters share the following two common initialization options:

- `handler`

    The API handler to use. As mentioned in the previous chapter, ZenStack provides two built-in API handler implementations. If you don't specify this option, the default API handler is RPC.
    
    - RPC handler: `@zenstackhq/server/api/rpc`
    - RESTful handler: `@zenstackhq/server/api/rest`

- `getPrisma`

    A callback function for getting a PrismaClient instance used for handling a CRUD request. The function is passed with a framework-specific request object. Although you can return a vanilla Prisma Client, mostly likely you should give an enhanced one so that access policies can be enforced.

### 🛠️ Adding CRUD API To Our Todo App

Let's see how we can automagically turn our ZModel schema into a web API without really coding it 🚀! For simplicity, we'll use Express for now, but the process of working with another framework is largely the same.

#### 1. Installing dependencies

First, install Express and the ZenStack server package:

```bash
npm install express @zenstackhq/server
npm install --save-dev @types/express tsx
```

#### 2. Creating an Express app

Create a file `main.ts` with the following content:

```ts
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ greet: 'Hello World!' });
});

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'));
```

Start the server:

```bash
npx tsx --watch main.ts
```

Make a request to verify everything is working:

```bash
curl http://localhost:3000
```

> { "greet": "Hello World!" }

#### 3. Adding ZenStack server adapter

Now let's create an express middleware and mount the CRUD API to the `/api/model` path. Replace `main.ts` with the following content:

```ts
import { PrismaClient } from '@prisma/client';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
app.use('/api/model', ZenStackMiddleware({ getPrisma: () => prisma }));

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'));
```

We've configured the server adapter to use a vanilla Prisma Client for now for quick testing. By default, the server adapter uses RPC-style API. We can hit the endpoint to do a few test now:

- Find a `List`

    ```bash
    curl "http://localhost:3000/api/model/list/findFirst"
    ```

    ```json
    {
        "data" : {
            "createdAt" : "2023-11-08T04:38:53.385Z",
            "id" : 1,
            "ownerId" : 1,
            "private" : false,
            "spaceId" : 1,
            "title" : "Grocery",
            "updatedAt" : "2023-11-09T04:52:57.987Z"
        },
        "meta" : {
            "serialization" : {
                "values" : {
                    "createdAt" : [ "Date" ],
                    "updatedAt" : [ "Date" ]
                }
            }
        }
    }
    ```

    :::info Metadata

    The `meta` field contains additional information about the response. In this case, it tells us that the `createdAt` and `updatedAt` fields are serialized from `Date` values. You'll learn more about it in the next chapter.

    :::

- Find a private `List`

    ```bash
    curl "http://localhost:3000/api/model/list/findFirst?q=%7B%22where%22%3A%7B%22private%22%3Atrue%7D%7D"
    ```

    :::info
    Parameter `q` is url-encoded `{"where":{"private":true}}`.
    :::

    ```json
    {
        "data" : {
            "createdAt" : "2023-11-11T02:34:29.880Z",
            "id" : 5,
            "ownerId" : 1,
            "private" : true,
            "spaceId" : 1,
            "title" : "Joey' List",
            "updatedAt" : "2023-11-11T02:34:29.880Z"
        },
        "meta" : { ...}
    }
    ```

- Create a `List`

    ```bash
    curl -XPOST "http://localhost:3000/api/model/list/create" \
        -d '{"data":{"title":"Jobs to be done","owner":{"connect":{"id":2}},"space":{"connect":{"id":1}}}}' \
        -H 'Content-Type: application/json'
    ```

    ```json
    {
        "data": {
            "id": 6,
            "createdAt": "2023-11-11T02:40:58.765Z",
            "updatedAt": "2023-11-11T02:40:58.765Z",
            "spaceId": 1,
            "ownerId": 2,
            "title": "Jobs to be done",
            "private": false
        },
        "meta": { ... }
    }
    ```

#### 4. Making access policies work

To make access policies work, we need to create an enhance Prisma Client, and to do that, we need to be able to get the current user from the request. Since we haven't implemented authentication yet, we'll simply use a special `x-user-id` header to pass user id for now. It's definitely not a secure implementation, but it's sufficient for demonstration purposes. We'll hook up a real authentication system in [Part IV](/docs/the-complete-guide/part4/).

Change the line of creating `ZenStackMiddleware` to the following:

```ts
import { Request } from 'express';
import { enhance } from '@zenstackhq/runtime';

function getUser(req: Request) {
    if (req.headers['x-user-id']) {
        return { id: parseInt(req.headers['x-user-id'] as string) };
    } else {
        return undefined;
    }
}

app.use('/api/model', 
    ZenStackMiddleware({ 
        getPrisma: (req) => enhance(prisma, { user: getUser(req) })
    })
);
```

Now, if we hit the endpoint again without the `x-user-id` header, we'll get null response:

```bash
curl "http://localhost:3000/api/model/list/findFirst"
```

```json
{ "data" : null }
```

Add the header and request again, we should get back a result then:

```bash
curl "http://localhost:3000/api/model/list/findFirst" -H "x-user-id: 1"
```

```json
{
  "data": {
    "id": 1,
    "createdAt": "2023-11-08T04:38:53.385Z",
    "updatedAt": "2023-11-09T04:52:57.987Z",
    "spaceId": 1,
    "ownerId": 1,
    "title": "Grocery",
    "private": false
  },
  "meta": { ... }
}
```

You can try other operations with different user identities. The service's behavior should be consistent with what we've seen in the REPL with the enhanced Prisma in [Part I](/docs/the-complete-guide/part1/access-policy/current-user#%EF%B8%8F-adding-user-based-access-control-to-our-todo-app).
