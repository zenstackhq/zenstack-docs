---
description: Prisma client extensions introduce a whole new level of extensibility. Let's explore its use cases and pitfalls.
tags: [openapi, restful, prisma, zenstack, database]
authors: yiming
date: 2023-03-18
---

# How to Build a Secure Database-centric OpenAPI Without Stress

```bash
mkdir express-petstore
cd express-petstore
npm init
npm i express
npm i -D typescript tsx @types/node @types/express
npx tsc --init
```

```ts
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'));
```

start server

```bash
tsx watch app.ts
```

```bash
curl localhost:3000
```

> Hello World!

// FIXME: zenstack init doesn't install prisma and @prisma/client.

```bash
npx zenstack@latest init
```

```prisma
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
```

```bash
npm i @zenstackhq/server
```

```ts
import { PrismaClient } from '@prisma/client';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
app.use('/api', ZenStackMiddleware({ getPrisma: () => prisma }));

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'));
```

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
