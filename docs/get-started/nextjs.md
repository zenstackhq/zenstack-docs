---
description: Step-by-step guide for using ZenStack with a Next.js project.
sidebar_position: 1
---

# For Next.js

Let's have some fun by creating a simple blogging app. You'll see how effortless it is to have a secure backend service without coding it.

## Requirements

Our target app should meet the following requirements:

1. Username/password based signin/signup
1. Logged-in users can create/update/publish/unpublish/delete their posts
1. Users cannot make changes to posts not belonging to them
1. Published post can be be viewed by all logged-in users

Let's get started 🚀.

## Prerequisite

1. Make sure you have Node.js 16 or above installed.
1. Install the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=zenstack.zenstack) for editing data models.

## Building the app

### 1. Create a new project

The easiest way to create a Next.js projects with boilerplates is with `create-t3-app`. Run the following command to create a new project with Prisma, NextAuth and TailwindCSS.

```bash
npx create-t3-app --prisma --nextAuth --tailwind --CI my-blog-app
cd my-blog-app
npm run dev
```

If everything worked, you should have a running Next.js app at [http://localhost:3000](http://localhost:3000).

<div align="center" ><img src="/img/t3app.png" width="640" /></div>

### 2. Initialize the project for ZenStack

Let's run the `zenstack` CLI to prepare your project for using ZenStack.

```bash
npx zenstack init
```

:::tip

The command installs a few NPM dependencies and also copies Prisma schema from `prisma/schema.prisma` to `schema.zmodel`, which is the schema file will keep updating moving forward. The `prisma/schema.prisma` will be automatically generated from `schema.zmodel`.

:::

### 3. Preparing the User model for authentication

First, in `schema.zmodel`, make a few changes to the `User` model:

```prisma {6,11-15} title='/schema.zmodel'
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String @password @omit
  image         String?
  accounts      Account[]
  sessions      Session[]

  // everyone can signup, and user profile is also publicly readable
  @@allow('create,read', true)

  // only the user can update or delete their own profile
  @@allow('update,delete', auth() == this)
}
```

For simplification, in this project we'll use username/password based authentication.
Above we added a `password` field to support it. We also added two access policy rules
to control permissions of this model.

:::tip

1. `@password` is a ZenStack attribute that marks a field to be hashed (using [bcryptjs](https://www.npmjs.com/package/bcryptjs)) before saving.
1. `@omit` indicates the field should be dropped when returned from query.
1. `@@allow` is a model level attribute for declaring access policies.

:::

Now run `zenstack generate` and `prisma db push` to flush the changes to the Prisma schema and database.

```bash
npx zenstack generate & npx prisma db push
```

4. Configure NextAuth to use credential-based auth

Now let's update `/src/pages/api/auth/[...nextauth].ts` to use credentials auth:

```ts {1-4,19-35} title='/src/pages/api/auth/[...nextauth].ts'
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../server/db/client';
import type { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        // Remove DiscordProvider below:
        // DiscordProvider({
        //   clientId: env.DISCORD_CLIENT_ID,
        //   clientSecret: env.DISCORD_CLIENT_SECRET,
        // }),

        CredentialsProvider({
            credentials: {
                email: {
                    type: 'email',
                },
                password: {
                    type: 'password',
                },
            },
            authorize: authorize(prisma),
        }),
    ],
};
```

Also add the `authorize` function for credentials verification:

```ts title=/src/pages/api/auth/[...nextauth].ts
function authorize(prisma: PrismaClient) {
    return async (
        credentials: Record<'email' | 'password', string> | undefined
    ) => {
        if (!credentials) throw new Error('Missing credentials');

        if (!credentials.email)
            throw new Error('"email" is required in credentials');

        if (!credentials.password)
            throw new Error('"password" is required in credentials');

        const maybeUser = await prisma.user.findFirst({
            where: { email: credentials.email },
            select: { id: true, email: true, password: true },
        });

        if (!maybeUser || !maybeUser.password) return null;

        // verify the input password with stored hash
        const isValid = await compare(credentials.password, maybeUser.password);
        if (!isValid) return null;

        return { id: maybeUser.id, email: maybeUser.email };
    };
}
```

### 4. Mount CRUD service & generate hooks

ZenStack has built-in support for Next.js and can provide database CRUD services
automagically so you don't need to write it yourself.

First install the `@zenstackhq/next` package:

```bash
npm install @zenstackhq/next
```

Let's mount it to the `/api/model/[...path]` endpoint:

```ts title='/src/pages/api/model/[...path]'
import { requestHandler } from '@zenstackhq/next';
import { withPresets } from '@zenstackhq/runtime';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';
import { prisma } from '../../../server/db/client';

async function getPrisma(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerAuthSession({ req, res });
    // create a wrapper of Prisma client that enforces access policy,
    // data validation, and @password, @omit behaviors
    return withPresets(prisma, { user: session?.user });
}

export default requestHandler({ getPrisma });
```

The `/api/model` route is now ready to access database query and mutation requests.
However, calling the service manually will be tedious. Fortunately, ZenStack can
automatically generate React hooks for you.

Let's enable it by adding the following snippet at the top level to `schema.zmodel`:

```prisma
plugin nestjs {
  provider = '@zenstack/react-hooks'
  output = "./src/lib/hooks"
}
```

Now run `zenstack generate` again, you'll find the hooks generated under `/src/lib/hooks` folder:

```bash
npx zenstack generate
```

Now we're ready to implement the signup/signin flow.

### 5. Implement Signup/Signin

Now let's implement the signup/signin pages. First, create a new page `/src/pages/signup.tsx`:

```tsx title='/src/pages/signup.tsx'
import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import { useUser } from '../lib/hooks';

const Signup: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { create: signup } = useUser();
    const router = useRouter();

    async function onSignup(e: FormEvent) {
        e.preventDefault();
        try {
            await signup({ data: { email, password } });
            alert('Signup successful!');
        } catch (err: any) {
            console.error(err);
            if (err.info?.prisma && err.info?.code === 'P2002') {
                // P2002 is Prisma's error code for unique constraint violations
                alert('User alread exists');
            } else {
                alert('An unknown error occurred');
            }
            return;
        }

        // signin to create a session
        await signIn('credentials', { redirect: false, email, password });
        router.push('/');
    }

    return (
        <div className="mx-auto flex flex-col items-center py-8">
            <h1 className="my-10 text-2xl">Create an account</h1>
            <form className="flex flex-col gap-4" onSubmit={onSignup}>
                <div>
                    <label htmlFor="email" className="inline-block w-20">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        className="ml-4 rounded border"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="inline-block w-20">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        className="ml-4 rounded border"
                    />
                </div>
                <input
                    type="submit"
                    value="Signup"
                    className="cursor-pointer rounded border border-gray-600 p-2"
                />
            </form>
        </div>
    );
};

export default Signup;
```

In the code above, we used the auto-generated `useUser` hooks create new `User` entities.

:::tip

1. The services backing the hooks are governed by access policies we defined. Here the `create`
   call can succeed because we explicitly allowed it in the `User` model. By default, all operations
   are forbidden.
1. `password` field is automatically hashed. You can confirm it by using a sqlite inspection tool
   to browse the `prisma/db.sqlite` database file.

:::

Try visiting [http://localhost:3000/signup](http://localhost:3000/signup) and create a new user.
It should looke like:

<div align="center" ><img src="/img/tutorial-signup-form.png" width="640" /></div>

Similarly, create the signin page `/src/pages/signin.tsx`:

```tsx title='/src/pages/signin.tsx'
import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';

const Signin: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function onSignin(e: FormEvent) {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.ok) {
            alert('User signed in successfully!');
            router.push('/');
        } else {
            alert('Signin failed');
        }
    }

    return (
        <div className="mx-auto flex flex-col items-center py-8">
            <h1 className="my-10 text-2xl">Signin to system</h1>
            <form className="flex flex-col gap-4" onSubmit={onSignin}>
                <div>
                    <label htmlFor="email" className="inline-block w-20">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        className="ml-4 rounded border"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="inline-block w-20">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        className="ml-4 rounded border"
                    />
                </div>
                <input
                    type="submit"
                    value="Signin"
                    className="cursor-pointer rounded border border-gray-600 p-2"
                />
            </form>
        </div>
    );
};

export default Signin;
```

### 6. Prepare the Blog model

Now let's create a `Blog` model. We'll use it to store blog posts.

```prisma title='/schema.zmodel'
model Post {
  id        String @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  published Boolean @default(false)
  author    User @relation(fields: [authorId], references: [id])
  authorId  String
}
```

`User` and `Post` model has a one-to-many relation. We can establish it by adding
a `posts` relation field to the `User` model.

```prisma {7} title='/schema.zmodel'
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String @password @omit
  posts         Post[]
  ...
}
```

Don't forget to regenerate and push to db:

```bash
npx zenstack generate && npx prisma db push
```

### 7. Build up the home page

Now let's change the main page and use it for viewing and managing posts.

```tsx title='/src/pages/index.tsx'

```

## Wrap up
