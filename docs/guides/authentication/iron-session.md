---
description: Integrating with iron-session.
sidebar_position: 2
sidebar_label: iron-session
---

# Integrating With iron-session

[Iron-session](https://www.npmjs.com/package/iron-session) is a lightweighted authentication toolkit. It works with Next.js, Express, and Node.js HTTP servers.

### Implement auth endpoints

Unlike NextAuth, iron-session requires you to implement auth-related API endpoints by yourself. Usually, you need to have at least these three endpoints: `api/auth/login`, `/api/auth/logout`, and `/api/auth/user`.

Implementing these endpoints can be done with a standard Prisma client. Here we show simple code snippets for how to do it in Next.js projects.

-   `/api/auth/login`

```ts title='/src/pages/api/auth/login.ts'
import { NextApiHandler } from 'next/types';
import { withIronSessionApiRoute } from 'iron-session/next';
import * as bcrypt from 'bcryptjs';
import { sessionOptions } from '../lib/sessionOptions';
import { prisma } from '../lib/db';

const loginRoute: NextApiHandler = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({
            message: 'invalid email and password combination',
        });
        return;
    }

    delete user.password;
    req.session.user = user;
    await req.session.save();

    res.json(user);
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
```

-   `/api/auth/logout`

```ts title='/src/pages/api/auth/logout.ts'
import { NextApiHandler } from 'next/types';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../lib/sessionOptions';

const logoutRoute: NextApiHandler = async (req, res) => {
    req.session.destroy();
    res.json({});
};

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
```

-   `/api/auth/user`

```ts title='/src/pages/api/auth/user.ts'
import { NextApiHandler } from 'next/types';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../lib/sessionOptions';
import { prisma } from '../lib/db';

const userRoute: NextApiHandler = async (req, res) => {
    if (req.session?.user) {
        // fetch user from db for fresh data
        const user = await prisma.user.findUnique({
            where: { email: req.session.user.email },
        });
        if (!user) {
            res.status(401).json({ message: 'invalid login status' });
            return;
        }

        delete user.password;
        res.json(user);
    } else {
        res.status(401).json({ message: 'invalid login status' });
    }
};

export default withIronSessionApiRoute(userRoute, sessionOptions);
```

### Create an enhanced Prisma client

You can create an enhanced Prisma client which automatically validates access policies, field validation rules etc., during CRUD operations. For more details, please refer to [ZModel Language](/docs/reference/zmodel-language) reference.

To create such a client with a standard setup, call the `withPresets` API with a regular Prisma client and the current user (fetched from iron-session). Here's an example:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withPresets } from '@zenstackhq/runtime';
import { prisma } from '../lib/db';

async function getPrisma(req: NextApiRequest, res: NextApiResponse) {
    // create a wrapper of Prisma client that enforces access policy,
    // data validation, and @password, @omit behaviors
    return withPresets(prisma, { user: req.session?.user });
}
```
