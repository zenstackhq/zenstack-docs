import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import GiscusComponent from '@site/src/components/GiscusComponent';

export default function BlogPostItemWrapper(props) {
    return (
        <>
            <BlogPostItem {...props} />
            <GiscusComponent />
        </>
    );
}
