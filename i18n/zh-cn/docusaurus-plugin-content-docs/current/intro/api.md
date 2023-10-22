---
description: Automatic CRUD API
sidebar_label: 4. Automatic CRUD API
sidebar_position: 4
---

# Automatic CRUD API

Many backend services have big chunks of code wrapping around the database and providing access-controlled CRUD APIs. These boring boilerplate codes are both tedious to write and error-prone to maintain.

With the access-policy-enhanced Prisma Client, ZenStack can automatically provide a full-fledged CRUD API for your data models through a set of framework-specific server adapters. Currently, we have adapters for [Next.js](https://nextjs.org), [SvelteKit](https://kit.svelte.dev/), [Express](https://expressjs.com/), and [Fastify](https://www.fastify.io/).

Let's see how it works using Express as an example.

```ts title='app.ts'

import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';
import { getSessionUser } from './auth'

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// options for creating the Express middleware that provides the CRUD API
const options = {
    // called for every request to get a Prisma Client instance
    getPrisma: (request) => {
        // getSessionUser extracts the current session user from the request,
        // its implementation depends on your auth solution
        const user = getSessionUser(request);

        // return a policy-enhanced Prisma Client
        return enhance(prisma, { user });
    }
}

// mount the middleware to "/api/model" route
app.use(
    '/api/model',
    ZenStackMiddleware(options)
);
```

:::info

There's no hard requirement to use an enhanced Prisma Client with the API, but you should always do it to ensure the APIs are protected when exposed to the Internet.

:::

With the code above, CRUD APIs are mounted at route "/api/model". By default, the APIs provide "RPC" style endpoints that mirror the Prisma Client APIs. For example, you can consume it like the following:

```ts
// Create a post for user#1
POST /api/model/post
{
    "data": {
        "title": "Post 1",
        "author": { "connect": { "id": 1 } }
    }
}

// List all published posts with their authors
GET /api/model/post/findMany?q={"where":{"published":true},"include":{"author":true}}
```

You can also choose to provide a more "REST" style API by initializing the middleware with a RESTful API handler:

```ts title='app.ts'
import RestApiHandler from '@zenstackhq/server/api/rest';

const options = {
    getPrisma: (request) => {...},
    // use RESTful-style API handler
    handler: RestApiHandler({ endpoint: 'http://myhost/api' })
}

// mount the middleware to "/api/model" route
app.use(
    '/api/model',
    ZenStackMiddleware(options)
);
```

Now the API endpoints follow the RESTful conventions (using [JSON:API](https://jsonapi.org/) as transport):

```ts
// Create a post for user#1
POST /api/model/post
{
    "data": {
        "type": 'post',
        "attributes": {
            "title": "Post 1"
        },
        relationships: {
            author: {
                data: { type: 'user', id: 1 }
            }
        }
    }
}

// List all published posts with their authors
GET /api/model/post?filter[published]=true&include=author
```
As you can see, with a few lines of code, you can get a full-fledged CRUD API for your data models. See [here](/docs/category/server-adapters) for details on using the server adapter specific to your framework. You may also be interested in generating an [OpenAPI](https://www.openapis.org/) specification using the [`@zenstackhq/openapi`](/docs/reference/plugins/openapi) plugin.

With the APIs in place, you can now use them to build the user interface. In the next section, let's see how ZenStack simplifies this part by generating data-access hooks for the frontend.
