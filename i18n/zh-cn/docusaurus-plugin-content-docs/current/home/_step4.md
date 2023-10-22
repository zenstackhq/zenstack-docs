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

// Next.js example for a blog post list component
// components/posts.tsx

// @noErrors
const Posts: FC = () => {
    // "usePost" is a generated hooks method
    const { findMany } = usePost();

    // list unpublished posts together with their author's data,
    // the result "posts" only include entities that are readable 
    // to the current user
    const posts = findMany({
        where: { published: false },
        include: { author: true },
        orderBy: { updatedAt: 'desc' },
    });

    // entities are accurately typed based on the query structure
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
