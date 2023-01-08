<!-- prettier-ignore -->
```tsx twoslash
import React, { FC } from 'react';

interface PostFindManyArgs {}

interface User {
    id: string;
    email: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    tags: string[];
    published: boolean;
}

function usePost(): {
    findMany: (args: PostFindManyArgs) => (Post & { author: User })[];
} {
    throw new Error('not implemented');
}

// ---cut---

// pages/posts.tsx

// @noErrors
const Posts: FC = () => {
    const { findMany } = usePost();

    // lists unpublished posts with their author's data
    const posts = findMany({
        where: { published: false },
        include: { author: true },
        orderBy: { updatedAt: 'desc' },
    });

    // "posts" is accurately typed based on the query structure
    return (
        <ul>
            {posts.map((post) => (
                     // ^?
                <li key={post.id}>{post.title} by { post.author.e }</li>
                                                              // ^|
            ))}
        </ul>
    );
};
```
