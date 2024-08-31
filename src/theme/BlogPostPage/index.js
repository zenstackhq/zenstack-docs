import React from 'react';
import clsx from 'clsx';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import { BlogPostProvider, useBlogPost } from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import TOC from '@theme/TOC';
import Unlisted from '@theme/Unlisted';
import GiscusComponent from '@site/src/components/GiscusComponent';
import { PostPaginator } from '@site/src/components/blog/post-paginator';

function getMultipleRandomElement(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
}

function BlogPostPageContent({ children }) {
    const { metadata, toc } = useBlogPost();
    const { relatedPosts } = metadata;

    const { nextItem, prevItem, frontMatter, unlisted } = metadata;
    const {
        hide_table_of_contents: hideTableOfContents,
        toc_min_heading_level: tocMinHeadingLevel,
        toc_max_heading_level: tocMaxHeadingLevel,
    } = frontMatter;

    const randomThreeRelatedPosts = getMultipleRandomElement(relatedPosts, 3);

    return (
        <BlogLayout
            toc={
                !hideTableOfContents && toc.length > 0 ? (
                    <TOC toc={toc} minHeadingLevel={tocMinHeadingLevel} maxHeadingLevel={tocMaxHeadingLevel} />
                ) : undefined
            }
        >
            {unlisted && <Unlisted />}
            <BlogPostItem>{children}</BlogPostItem>
            <PostPaginator title="Related Articles" posts={randomThreeRelatedPosts}></PostPaginator>
            <GiscusComponent />
            {(nextItem || prevItem) && <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />}
        </BlogLayout>
    );
}
export default function BlogPostPage(props) {
    const BlogPostContent = props.content;
    console.log('props', props);
    return (
        <BlogPostProvider content={props.content} isBlogPostPage>
            <HtmlClassNameProvider
                className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogPostPage)}
            >
                <BlogPostPageMetadata />
                <BlogPostPageContent sidebar={props.sidebar}>
                    <BlogPostContent />
                </BlogPostPageContent>
            </HtmlClassNameProvider>
        </BlogPostProvider>
    );
}
