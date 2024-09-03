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

function getMultipleRandomPosts(relatedPosts, number) {
    // Create a copy of the original array to avoid modifying it
    const weightedItems = [...relatedPosts];
    const result = [];

    weightedItems.forEach((item) => {
        //square the weight to increase the chance of the post being selected
        //add a new field to avoid modify the original object
        item.sortWeight = weightedItems.length > 15 ? Math.pow(item.relatedWeight, 2) : item.relatedWeight;
    });

    // Calculate the total weight
    let totalWeight = weightedItems.reduce((sum, item) => sum + item.sortWeight, 0);

    while (weightedItems.length > 0) {
        // Generate a random value between 0 and the total weight
        const randomValue = Math.random() * totalWeight;
        let weightSum = 0;
        let selectedIndex = -1;

        // Find the item that corresponds to the random value
        for (let i = 0; i < weightedItems.length; i++) {
            weightSum += weightedItems[i].sortWeight;
            if (randomValue <= weightSum) {
                selectedIndex = i;
                break;
            }
        }

        // If an item was selected, add it to the result and remove it from the original array
        if (selectedIndex !== -1) {
            const [selectedItem] = weightedItems.splice(selectedIndex, 1);
            result.push(selectedItem);
            totalWeight -= selectedItem.sortWeight;
        }
    }

    return result.slice(0, number);
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

    const randomThreeRelatedPosts = getMultipleRandomPosts(relatedPosts, 3);

    console.log('relatedPosts', relatedPosts);

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
