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
                <div className="flex flex-col not-prose ">
                    {posts.map((post) => (
                        <Link
                            to={post.permalink}
                            rel="dofollow"
                            key={post.permalink ?? post.id}
                            style={{ color: 'var(--ifm-font-color-base)' }}
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
                            <div className={clsx('font-bold', 'group-hover:underline')}>{post.title}</div>

                            <p
                                className={clsx('font-sm')}
                                style={{
                                    display: '-webkit-box',
                                    '-webkit-line-clamp': '3',
                                    '-webkit-box-orient': 'vertical',
                                    overflow: 'hidden',
                                    'text-overflow': 'ellipsis',
                                }}
                            >
                                {post.description}
                            </p>
                        </Link>
                    ))}
                    <p className="mt-8 mb-6 p-0 text-xl font-bold">
                        🚀 Ready to build high-quality, scalable Prisma apps with built-in AuthZ and instant CRUD APIs ?
                    </p>
                    <Link className="mb-4 p-0 text-xl font-bold underline" to="/docs/welcome">
                        Get started with ZenStack's ultimate guide to build faster and smarter
                    </Link>
                </div>
            </div>
        </div>
    );
};
