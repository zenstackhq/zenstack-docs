import React from 'react';
import Link from '@docusaurus/Link';

import clsx from 'clsx';

export const PostPaginator = ({ posts, title }) => {
    if (posts.length < 1) {
        return null;
    }

    return (
        <div
            className={clsx(
                'mr-auto w-full',
                'py-10',
                'blog-sm:py-12',
                'blog-md:py-16',
                'max-w-[894px]',
                'blog-sm:max-w-screen-blog-sm',
                'blog-lg:max-w-screen-content-2xl'
            )}
        >
            <div className="blog-sm:px-6 w-full">
                <h2 className="mb-4 p-0 text-2xl font-semibold">{title}</h2>
                <div className="flex flex-col not-prose">
                    {posts.map((post) => (
                        <Link
                            to={post.permalink}
                            rel="dofollow"
                            key={post.permalink ?? post.id}
                            className={clsx(
                                'flex',
                                'flex-col',
                                'gap-2',
                                'p-5',
                                'mb-5',
                                'rounded-lg',
                                'border',
                                'hover:bg-gray-100',
                                'dark:hover:bg-gray-800',
                                'not-prose',
                                'no-underline',
                                'border-solid',
                                'border',
                                'hover:no-underline',
                                'group'
                            )}
                        >
                            <div
                                to={post.permalink}
                                rel="dofollow"
                                className={clsx('font-bold', 'group-hover:underline')}
                            >
                                {post.title}
                            </div>

                            <p className={clsx('font-sm')}>{post.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
