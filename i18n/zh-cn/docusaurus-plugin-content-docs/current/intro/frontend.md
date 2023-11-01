---
description: 前端数据访问
sidebar_label: 5. 前端数据访问
sidebar_position: 5
---

# 前端数据访问

ZenStack有一个小的核心，它的许多功能都是作为插件实现的。生成前端数据访问库就是这种插件的一个很好的例子。例如，您可以启用TanStack Query钩子的生成（对于React），如下所示：

```zmodel

plugin hooks {
    provider = "@zenstackhq/tanstack-query"
    output = "./src/lib/hooks"
    target = "react"
}

```

生成的钩子提供了一组API，这些API与Prisma Client的API非常相似，并调用了上一节中介绍的自动增查改删 API。 这里有一些使用它们的例子：

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

ZenStack目前提供插件，用于生成针对[TanStack Query](/docs/reference/plugins/tanstack-query)（支持React和Vue）和[SWR](/docs/reference/plugins/swr)（仅支持React）的客户端钩子。
