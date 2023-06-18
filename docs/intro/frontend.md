---
description: Frontend Data Access
sidebar_position: 4
---

# Frontend Data Access

ZenStack has a small core, and many of its functionalities are implemented as plugins. Generating frontend data access library is good example of such a plugin. For example, you can enable the generation of TanStack Query hooks (for React) as follows:

```prisma

plugin hooks {
    provider = "@zenstackhq/tanstack-query"
    output = "./src/lib/hooks"
    target = "react"
}

```

The generated hooks provide a set of APIs closely mirror that of Prisma client, and calls into the automatic CRUD API introduced in the previous section. Here're a few examples for using them:

```tsx

import type { Post } from '@prisma/client';
import { useFindManyPost, useCreatePost } from '../lib/hooks';

// post list component
const Posts = ({ userId }: { userId: string }) => {
    const create = useCreatePost();

    // list all posts that're visible to the current user, together with their authors
    const { data: posts } = useFindManyPost({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });

    async function onCreatePost() {
        create.mutate({
            data: {
                title: 'My awesome post',
                authorId: userId,
            },
        });
    }

    return (
        <>
            <button onClick={onCreatePost}>Create</button>
            <ul>
                {posts?.map((post) => (
                    <li key={post.id}>
                        {post.title} by {post.author.email}
                    </li>
                ))}
            </ul>
        </>
    );
};

```

ZenStack currently provides plugins for generating client hooks targeting [TanStack Query](/docs/reference/plugins/tanstack-query) (supports React and Vue) and [SWR](/docs/reference/plugins/swr) (React only).
