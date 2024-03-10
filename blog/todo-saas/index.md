---
description: Almost all the SaaS now is collaborative. Technically, we need to build the foundation to support tenant isolation with an access control policy. This tutorial demonstrates how to build it using Next.js and ZenStack and the benefit of using a data model as the single source of truth to handle access control.
tags: [tutorial, nextjs, saas, zenstack]
authors: jiasheng
date: 2023-04-15
image: https://res.cloudinary.com/practicaldev/image/fetch/s--WLKu4akj--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ydzbjvpeiyuw0hahx1hv.jpg
---

# How to Build a Fully Functional ToDo SaaS Using Next.js and ZenStack's Access Control Policy

![Cover Image](https://res.cloudinary.com/practicaldev/image/fetch/s--WLKu4akj--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ydzbjvpeiyuw0hahx1hv.jpg)

Almost all the SaaS now is collaborative, from the originator Salesforce to the newly emerging one like Notion. To make it collaborative, technically, we need to build the foundation to support **tenant isolation** with an access control policy. A classic challenge here is striking a balance between app security and dev productivity. ZenStack’s access policy provides an innovative way to achieve that balance using the declarative schema.

<!--truncate-->

## Prerequisite

This article is the second part of the tutorial on building the app from scratch. It is assumed that you have read the first part of it to build the SaaS team space below:

[How to build a collaborative SaaS product using Next.js and ZenStack's access control policy](https://zenstack.dev/blog/saas-demo)

So it will continue from there to adding the ToDo functionality below:

-   Create/Delete a Todo list, either public or private. Public means others in the same team space could see it.
-   Create/Delete/Complete a Todo under a Todo list.

![ToDo](https://user-images.githubusercontent.com/16688722/232254395-17d97ebb-fc13-4548-90b0-564cc7f52654.png)

## 1. Define schema

### **Relations**

We will add two new models `List` and `Todo`. The relationship between them and the existing `Space` is [One-to-many](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/one-to-many-relations) relation like below:

![relation](https://user-images.githubusercontent.com/16688722/232254073-e3df3d77-75da-4160-afa2-80e2440cf987.png)

The model definitions would be like below:

```zmodel
model List {
    id String @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    space Space @relation(fields: [spaceId], references: [id], onDelete: Cascade)
    spaceId String
    owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId String
    title String @length(1, 100)
    // whether it is private
    private Boolean @default(false)
    todos Todo[]
}

model Todo {
    id String @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId String
    list List @relation(fields: [listId], references: [id], onDelete: Cascade)
    listId String
    title String @length(1, 100)
    // completed time
    completedAt DateTime?
}
```

Then we should also add the reversed relation fields in `User` and `Space`

```zmodel
model User {
    ...
    lists List[]
    todos Todo[]
    ...
}

model Space {
    ...
    lists List[]
    ...
}
```

### Access Policy

Do you still remember how did we achieve **tenant isolation** using [Collection Predicate Expression](https://zenstack.dev/docs/reference/zmodel-language#collection-predicate-expressions)? If not, please take this chance to review it quickly because that’s the foundation here.

-   List

    ```zmodel
    model List {
        ...
        // require login
        @@deny('all', auth() == null)

        // can be read by owner or space members (only if not private)
        @@allow('read', owner == auth() || (space.members?[user == auth()] && !private))

        // when create, owner must be set to current user, and user must be in the space
        @@allow('create', owner == auth() && space.members?[user == auth()])

        // when create, owner must be set to current user, and user must be in the space
        // update is not allowed to change owner
        @@allow('update', owner == auth() && space.members?[user == auth()] && future().owner == owner)

        // can be deleted by owner
        @@allow('delete', owner == auth())
    }
    ```

    You can see `space.members?[user == auth()]` almost appears in every rule. For the same example, I used in the first article. It checks that if **Auth** is in the same space as **Bob**:
    ![bob](https://user-images.githubusercontent.com/16688722/232254072-20fab15e-3f16-43f4-afff-8dfaae330a72.png)
    Have you noticed there is a new `future()` used in the update rule? This is used to do the post-update check. By default, in the update rule, all the fields referenced in the expression refer to the “pre” state. However, in some cases, we want to restrict the “post” state. As in this example, we want to ensure that an update cannot alter its owner.

-   Todo

    ```zmodel
    model Todo {
        ...
        // require login
        @@deny('all', auth() == null)

        // owner has full access, also space members have full access (if the parent List is not private)
        @@allow('all', list.owner == auth())
        @@allow('all', list.space.members?[user == auth()] && !list.private)

        // update cannot change owner
        @@deny('update', future().owner != owner)
    }
    ```

    There should have nothing new for you now.

Now let’s run the below command to flush the change to the Prisma schema and database:

```tsx
npx zenstack generate && npx prisma db push
```

Congratulations! With ZenStack, once the schema is completed, the majority of the backend work is already completed, freeing up your time to concentrate on the front-end work.

## 2. Todo List

Let’s create the Todo list component under `/src/components/TodoList.tsx` :

```tsx
import { LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useList } from '@lib/hooks';
import { List } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { User } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from './Avatar';
import TimeInfo from './TimeInfo';

type Props = {
    value: List & { owner: User };
    deleted?: (value: List) => void;
};

export default function TodoList({ value, deleted }: Props) {
    const router = useRouter();

    const { del } = useList();

    const deleteList = async () => {
        if (confirm('Are you sure to delete this list?')) {
            await del({ where: { id: value.id } });
            if (deleted) {
                deleted(value);
            }
        }
    };
    // html
    return (...}
}
```

Then, let’s show the Todo list in the space home page under `src/pages/space/[slug]/index.tsx`:

```tsx
import { SpaceContext, UserContext } from '@lib/context';
import { useList } from '@lib/hooks';
import { List, Space, User } from '@prisma/client';
import BreadCrumb from 'components/BreadCrumb';
import SpaceMembers from 'components/SpaceMembers';
import TodoList from 'components/TodoList';
import WithNavBar from 'components/WithNavBar';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
    ChangeEvent,
    FormEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { toast } from 'react-toastify';
import { getEnhancedPrisma } from 'server/enhanced-db';

function CreateDialog({ created }: { created: (list: List) => void }) {...}

type Props = {
    space: Space;
    lists: (List & { owner: User })[];
};

export default function SpaceHome(props: Props) {
    const router = useRouter();
    const { findMany } = useList();

    const { data: lists, mutate: refetch } = findMany(
        {
            where: {
                space: {
                    slug: router.query.slug as string,
                },
            },
            include: {
                owner: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        },
        {
            disabled: !router.query.slug,
            initialData: props.lists,
        }
    );
   // html
   return (...)
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
    req,
    res,
    params,
}) => {
    const db = await getEnhancedPrisma({ req, res });

    const space = await db.space.findUnique({
        where: { slug: params!.slug as string },
    });
    if (!space) {
        return {
            notFound: true,
        };
    }

    const lists = await db.list.findMany({
        where: {
            space: { slug: params?.slug as string },
        },
        include: {
            owner: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return {
        props: { space, lists },
    };
};
```

Same as before, when calling `findMany` to get all the Todo lists that could be seen by the current user either in auto-generated hooks or `getServerSideProps`, the only filter you need to specify is the space slug, which is because one user could belong to multiple spaces.

You don’t need to worry about whether a Todo list is created by a current user or is public to be seen. **You just write the simple query and let ZenStack take care of it based on the access policy defined in the schema.**

Let’s still use the ZenStack team space to do the little test:

![team-space](https://user-images.githubusercontent.com/16688722/232254071-0c3ba9d4-5fba-4615-a975-788b41eed316.png)

Let’s create two Todo lists, public and private each by admin. Then from Bob’s account it could only see the public one:

![Todo-lists](https://user-images.githubusercontent.com/16688722/232254069-cb59380c-4597-423d-b5cd-51dcd82b613d.png)

## 3. Todo

Let’s create the Todo component under `src/components/Todo.tsx` :

```tsx
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTodo } from '@lib/hooks';
import { Todo, User } from '@prisma/client';
import { ChangeEvent } from 'react';
import Avatar from './Avatar';
import TimeInfo from './TimeInfo';

type Props = {
    value: Todo & { owner: User };
    updated?: (value: Todo) => any;
    deleted?: (value: Todo) => any;
};

export default function TodoComponent({ value, updated, deleted }: Props) {
    const { update, del } = useTodo();

    const deleteTodo = async () => {
        await del({ where: { id: value.id } });
        if (deleted) {
            deleted(value);
        }
    };

    const toggleCompleted = async (completed: boolean) => {
        if (completed === !!value.completedAt) {
            return;
        }
        const newValue = await update({
            where: { id: value.id },
            data: { completedAt: completed ? new Date() : null },
        });
        if (updated && newValue) {
            updated(newValue);
        }
    };
    // html
    return (...);
}
```

Then let’s add a new page for a Todo list to show all the Todos under `src/pages/space/[slug]/[listId]/index.tsx` :

```tsx
import { PlusIcon } from '@heroicons/react/24/outline';
import { useCurrentUser } from '@lib/context';
import { useTodo } from '@lib/hooks';
import { List, Space, Todo, User } from '@prisma/client';
import BreadCrumb from 'components/BreadCrumb';
import TodoComponent from 'components/Todo';
import WithNavBar from 'components/WithNavBar';
import { GetServerSideProps } from 'next';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { getEnhancedPrisma } from 'server/enhanced-db';

type Props = {
    space: Space;
    list: List;
    todos: (Todo & { owner: User })[];
};

export default function TodoList(props: Props) {
    const user = useCurrentUser();
    const [title, setTitle] = useState('');
    const { findMany, create } = useTodo();

    const { data: todos, mutate: refetch } = findMany(
        {
            where: { listId: props.list.id },
            include: {
                owner: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        },
        { initialData: props.todos, disabled: !props.list }
    );

    const _createTodo = async () => {
        try {
            const todo = await create({
                data: {
                    title,
                    owner: { connect: { id: user!.id } },
                    list: { connect: { id: props.list.id } },
                },
            });
            console.log(`Todo created: ${todo}`);
            setTitle('');
            refetch();
        } catch (err: any) {
            toast.error(
                `Failed to create todo: ${err.info?.message || err.message}`
            );
        }
    };

    if (!props.space || !props.list) {
        return <></>;
    }

    // html
    return (...);
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
    req,
    res,
    params,
}) => {
    const db = await getEnhancedPrisma({ req, res });
    const space = await db.space.findUnique({
        where: { slug: params!.slug as string },
    });
    if (!space) {
        return {
            notFound: true,
        };
    }

    const list = await db.list.findUnique({
        where: { id: params!.listId as string },
    });
    if (!list) {
        return {
            notFound: true,
        };
    }

    const todos = await db.todo.findMany({
        where: { listId: params?.listId as string },
        include: {
            owner: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return {
        props: { space, list, todos },
    };
};
```

All done. Then you can enjoy collaborating in the team space now:

![Todo](https://user-images.githubusercontent.com/16688722/232254067-f8d562b7-7acc-4579-a782-adc44f8f8550.png)

## 4. Requirement Change

Now we could only see the public Todo list in the space. Let’s say we would like to change it so that all the Todo lists could be seen. But for the private list, the todo under it could only be seen by its owner.

How many places do you think we need to change? Actually just one in the `List` model:

![change](https://user-images.githubusercontent.com/16688722/232254065-c8fd254b-3eec-4fea-a99b-27893fb76450.png)

**That’s the beauty of ZenStack, occasionally, achieving your desired result can be simply modifying the schema file without requiring any changes to the JS/TS code.**

## Conclusion

I hope this tutorial can show you the benefit of [ZenStack](https://zenstack.dev/) in using the data model as the single source of truth to handle access control.

Feel free to contact us on our [Discord](https://discord.gg/Ykhr738dUe) or [GitHub](https://github.com/zenstackhq/zenstack) if you have any questions about it.
