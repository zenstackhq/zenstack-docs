---
description: How to build a secure and documented database-centric OpenAPI service within 15 minutes using Express.js and ZenStack.
tags: [openapi, restful, prisma, zenstack, database]
authors: yiming
date: 2023-03-18
---

# Building a Secure Database-centric OpenAPI In 15 Minutes

If you are a developer who is familiar with RESTful APIs, you might have heard of [OpenAPI](https://swagger.io/specification/). It is a specification for describing RESTful APIs in format readable for both human and machine. Building a public-facing OpenAPI include three tasks:

1. Authoring an OpenAPI specification which serves as the contract between the API provider and the API consumer.
1. Implementing the API endpoints based on the specification.
1. Optionally, implementing client SDKs for consuming the API.

In this post, you'll see how to accomplish all these tasks and build a database-centric OpenAPI service, secure and and documented, within 15 minutes.

## Scenario

To facilitate easier understanding, I'm going to use a simple Pet Store API as an example. The API will have the following resources:

-   User: who can signup, login, and order pets.
-   Pet: which can be listed, ordered by users.
-   Order: which is created by users and contains a list of pets.

**Business rules:**

1. Anonymous users can sign up and login.
1. Anonymous users can list unsold pets.
1. Authenticated users can list unsold pets and pets ordered by them.
1. Authenticated users can create order for unsold pets.
1. Authenticated users can view their orders.

## Building it up

We'll use Express.js as the framework for building the service. Other frameworks, like Fastify, can be used as well, and the general process is similar.

### 1. Creating the project

Let's first create a new Express.js project with Typescript.

```bash
mkdir express-petstore
cd express-petstore
npm init
npm install express
npm install -D typescript tsx @types/node @types/express
npx tsc --init
```

Create the service entrance point code `app.ts` with the following content:

```ts title='app.ts'
import express from 'express';

const app = express();

// enable JSON body parser
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'));
```

Start the server:

```bash
tsx watch app.ts
```

Now in a new shell window, hit the service endpoint and verify it works:

```bash
curl localhost:3000
```

> Hello World!

### 2. Modeling data

Data modeling is the most crucial part of building a resource-centric API. In this guide, we'll use [Prisma](https://prisma.io) and [ZenStack](https://zenstack.dev) to model the database. Prisma is a toolkit that offers a declarative data modeling experience, and ZenStack is a power pack to Prisma providing enhancements like access control, specification generation, automatic service generation, and many other improvements.

// FIXME: zenstack init doesn't install prisma and @prisma/client.

Let's first initialize our project for data modeling:

```bash
npx zenstack@latest init
```

The `zenstack` CLI installs Prisma and other dependencies, and also creates a boilerplate `schema.zmodel` file. Update it with the following content to reflect our requirements:

```prisma title='schema.zmodel'
datasource db {
    provider = 'sqlite'
    url = 'file:./petstore.db'
}

generator client {
    provider = "prisma-client-js"
}

model User {
    id String @id @default(cuid())
    email String @unique
    password String
    orders Order[]
}

model Pet {
    id String @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    name String
    category String
    order Order? @relation(fields: [orderId], references: [id])
    orderId String?
}

model Order {
    id String @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    pets Pet[]
    user User @relation(fields: [userId], references: [id])
    userId String
}
```

Also, create a `prisma/seed.ts` file which populates the database with some data. When you reset your local database, you can rerun to the script to fill in data.

````ts title='prisma/seed.ts'

```ts title='prisma/seed.ts'
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const petData: Prisma.PetCreateInput[] = [
    {
        name: 'Luna',
        category: 'cattie',
    },
    {
        name: 'Max',
        category: 'doggie',
    },
    {
        name: 'Cooper',
        category: 'reptile',
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (const p of petData) {
        const pet = await prisma.pet.create({
            data: p,
        });
        console.log(`Created Pet with id: ${pet.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
````

Generates database client, push the schema to the database, and seed it:

```bash
npx zenstack generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Implementing the API

ZenStack greatly simplifies the development of database-centric APIs by providing a built-in RESTful implementation. You can use a framework-specific adapter to install the RESTful services into your application. Let's see how to do it with Express.js.

```bash
npm install @zenstackhq/server
```

The integration with Express.js is achieved by the `ZenStackMiddleware` middleware factory. Use it to mount the RESTful APIs at the path of your choice. The `getPrisma` callback is used for getting a Prisma client instance for the current request. For now we'll just return the global Prisma client.

```ts title='app.ts'
import { PrismaClient } from '@prisma/client';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
app.use('/api', ZenStackMiddleware({ getPrisma: () => prisma }));

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'));
```

With these few lines of code, you've got CRUD APIs running for all resources - `User`, `Pet` and `Order`. Test it by fetching all pets:

```bash
curl localhost:3000/api/pet/findMany
```

```json
[
    {
        "id": "clfamyjp60000vhql266hko28",
        "createdAt": "2023-03-16T04:53:26.203Z",
        "updatedAt": "2023-03-16T05:59:04.586Z",
        "name": "Luna",
        "category": "kitten",
        "orderId": null
    },
    {
        "id": "clfamyjp90002vhql2ng70ay8",
        "createdAt": "2023-03-16T04:53:26.205Z",
        "updatedAt": "2023-03-16T04:53:26.205Z",
        "name": "Max",
        "category": "doggie",
        "orderId": null
    },
    {
        "id": "clfamyjpa0004vhql4u0ys8lf",
        "createdAt": "2023-03-16T04:53:26.206Z",
        "updatedAt": "2023-03-16T04:53:26.206Z",
        "name": "Cooper",
        "category": "reptile",
        "orderId": null
    }
]
```

Easy, isn't it? The automatically generated APIs have 1:1 mapping to Prisma client methods: `findMany`, `findUnique`, `create`, `update`, `aggreate`, etc. They also have the same structure as Prisma client for input arguments and responses. For `POST` and `PUT` requests, the input args are sent directly as the request body (application/json). For `GET` and `DELETE` requests, the input args is JSON serialized and sent as the `q` query parameters (url-encoded). For example, you can get a filtered list of pets by:

```bash
# q={"where":{"category":"doggie"}}
curl 'http://localhost:3000/api/pet/findMany?q=%7B%22where%22%3A%7B%22category%22%3A%22doggie%22%7D%7D'
```

```json
[
    {
        "id": "clfamyjp90002vhql2ng70ay8",
        "createdAt": "2023-03-16T04:53:26.205Z",
        "updatedAt": "2023-03-16T04:53:26.205Z",
        "name": "Max",
        "category": "doggie",
        "orderId": null
    }
]
```

Our API is up and running, but it has one big problem: it's not secure. Anybody can read and update any data. Let's fix that in the next sections in two steps: authentication and authorization.

### 4. Adding authentication

### 5. Adding authorization

## Access policies

```prisma
model User {
    id String @id @default(cuid())
    email String @unique @email
    password String
    orders Order[]

    // everybody can signup
    @@allow('create', true)

    // full access by self
    @@allow('all', auth() == this)
}

model Pet {
    id String @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    name String
    category String
    order Order? @relation(fields: [orderId], references: [id])
    orderId String?

    // unsold pets are readable to all; sold ones are readable to buyers only
    @@allow('read', orderId == null || order.user == auth())
}

model Order {
    id String @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    pets Pet[]
    user User @relation(fields: [userId], references: [id])
    userId String

    // users can CRUD orders for themselves
    @@allow('all', auth() == user)
}
```

## Signup and login

```prisma
model User {
    id String @id @default(cuid())
    email String @unique
    password String @password
    orders Order[]

    // everybody can signup
    @@allow('create', true)

    // full access by self
    @@allow('all', auth() == this)
}
```

```bash
npx zenstack generate && npx prisma db push
```

```bash
npm i bcryptjs jsonwebtoken dotenv
npm i -D @types/jsonwebtoken
```

```
JWT_SECRET=abc123
```

signup

```bash
curl -X POST localhost:3000/api/user/create \
    -H 'Content-Type: application/json' \
    -d '{ "data": { "email": "tom@pet.inc", "password": "abc123" } }'
```

```json
{
    "id": "clfan0lys0000vhtktutornel",
    "email": "tom@pet.inc"
}
```

login

```ts
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: { email },
    });
    console.log('password:', user?.password);
    if (!user || !compareSync(password, user.password)) {
        res.status(401).json({ error: 'Invalid credentials' });
    } else {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
        res.json({ id: user.id, email: user.email, token });
    }
});
```

```bash
curl -X POST localhost:3000/api/login \
-H 'Content-Type: application/json' \
-d '{ "email": "tom@pet.inc", "password": "abc123" }'
```

```json
{
    "id": "clfan0lys0000vhtktutornel",
    "email": "tom@pet.inc",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGZhbjBseXMwMDAwdmh0a3R1dG9ybmVsIiwiaWF0IjoxNjc4OTQzMjI0fQ._2dTPCaU7rbN7xT5oHOFF2yq_8n4hhxY3LcEw-olKIw"
}
```

record token

```bash
token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGZhbjBseXMwMDAwdmh0a3R1dG9ybmVsIiwiaWF0IjoxNjc4OTQzMjI0fQ._2dTPCaU7rbN7xT5oHOFF2yq_8n4hhxY3LcEw-olKIw
```

create an order

```bash
curl -X POST localhost:3000/api/order/create \
    -H 'Content-Type: application/json' -H "Authorization: Bearer $token"  \
    -d '{ "data": { "userId": "clfan0lys0000vhtktutornel", "pets": { "connect": { "id": "clfamyjp60000vhql266hko28" } } } }'
```

```json
{
    "id": "clfapaykz0002vhwr634sd9l7",
    "createdAt": "2023-03-16T05:59:04.586Z",
    "updatedAt": "2023-03-16T05:59:04.586Z",
    "userId": "clfan0lys0000vhtktutornel"
}
```

find all pets anonymously, Luna is gone now

```bash
curl localhost:3000/api/pet/findMany
```

```json
[
    {
        "id": "clfamyjp90002vhql2ng70ay8",
        "createdAt": "2023-03-16T04:53:26.205Z",
        "updatedAt": "2023-03-16T04:53:26.205Z",
        "name": "Max",
        "category": "doggie",
        "orderId": null
    },
    {
        "id": "clfamyjpa0004vhql4u0ys8lf",
        "createdAt": "2023-03-16T04:53:26.206Z",
        "updatedAt": "2023-03-16T04:53:26.206Z",
        "name": "Cooper",
        "category": "reptile",
        "orderId": null
    }
]
```

find orders anonymously

```bash
curl localhost:3000/api/order/findMany
```

```json
[]
```

find pets with token

```bash
curl localhost:3000/api/pet/findMany -H "Authorization: Bearer $token"
```

```json
[
    {
        "id": "clfamyjp60000vhql266hko28",
        "createdAt": "2023-03-16T04:53:26.203Z",
        "updatedAt": "2023-03-16T05:59:04.586Z",
        "name": "Luna",
        "category": "kitten",
        "orderId": "clfapaykz0002vhwr634sd9l7"
    },
    {
        "id": "clfamyjp90002vhql2ng70ay8",
        "createdAt": "2023-03-16T04:53:26.205Z",
        "updatedAt": "2023-03-16T04:53:26.205Z",
        "name": "Max",
        "category": "doggie",
        "orderId": null
    },
    {
        "id": "clfamyjpa0004vhql4u0ys8lf",
        "createdAt": "2023-03-16T04:53:26.206Z",
        "updatedAt": "2023-03-16T04:53:26.206Z",
        "name": "Cooper",
        "category": "reptile",
        "orderId": null
    }
]
```

find orders with token

```bash
curl "localhost:3000/api/order/findMany?q=%7B%22include%22%3A%7B%22pets%22%3Atrue%7D%7D" -H "Authorization: Bearer $token"
```

```json
[
    {
        "id": "clfapaykz0002vhwr634sd9l7",
        "createdAt": "2023-03-16T05:59:04.586Z",
        "updatedAt": "2023-03-16T05:59:04.586Z",
        "userId": "clfan0lys0000vhtktutornel",
        "pets": [
            {
                "id": "clfamyjp60000vhql266hko28",
                "createdAt": "2023-03-16T04:53:26.203Z",
                "updatedAt": "2023-03-16T05:59:04.586Z",
                "name": "Luna",
                "category": "kitten",
                "orderId": "clfapaykz0002vhwr634sd9l7"
            }
        ]
    }
]
```

## Serve documentation

```bash
npm install swagger-ui-express express-jsdoc-swagger
npm install -D @types/swagger-ui-express
```

```bash
npx zenstack generate
```

Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

![Swagger UI](2023-03-16-14-23-07.png)

## Generate client

```bash
npm install -D openapi-typescript
npm install openapi-typescript-fetch
```

```bash
openapi-typescript http://localhost:3000/v3/api-docs --output ./client-types.ts
```

## Trying it out
