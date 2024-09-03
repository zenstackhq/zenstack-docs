const blogPluginExports = require('@docusaurus/plugin-content-blog');
const utils = require('@docusaurus/utils');
const path = require('path');

const defaultBlogPlugin = blogPluginExports.default;
const MIN_RELATED_POSTS = 10;

function getMultipleRandomElement(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
}

function getRelatedPosts(allBlogPosts, metadata) {
    const currentTags = new Set(metadata.frontMatter.tags?.filter((tag) => tag?.toLowerCase() != 'zenstack'));

    let relatedPosts = allBlogPosts.filter(
        (post) =>
            post.metadata.frontMatter.tags.some((tag) => currentTags.has(tag)) && post.metadata.title !== metadata.title
    );

    if (relatedPosts.length < MIN_RELATED_POSTS) {
        remainingCount = MIN_RELATED_POSTS - relatedPosts.length;
        const remainingPosts = getMultipleRandomElement(
            allBlogPosts.filter((post) => !relatedPosts.includes(post) && post.metadata.title !== metadata.title),
            remainingCount
        );
        relatedPosts = relatedPosts.concat(remainingPosts);
    }

    const filteredPostInfos = relatedPosts.map((post) => {
        return {
            title: post.metadata.title,
            description: post.metadata.description,
            permalink: post.metadata.permalink,
            formattedDate: post.metadata.formattedDate,
            authors: post.metadata.authors,
            readingTime: post.metadata.readingTime,
            date: post.metadata.date,
            relatedWeight: post.metadata.frontMatter.tags.filter((tag) => currentTags.has(tag)).length * 4 + 1,
        };
    });

    return filteredPostInfos;
}

async function blogPluginExtended(...pluginArgs) {
    const blogPluginInstance = await defaultBlogPlugin(...pluginArgs);

    return {
        // Add all properties of the default blog plugin so existing functionality is preserved
        ...blogPluginInstance,
        contentLoaded: async function (data) {
            await blogPluginInstance.contentLoaded(data);
            const { content: blogContents, actions } = data;
            const { blogPosts: allBlogPosts } = blogContents;
            const { createData } = actions;
            // Create routes for blog entries.
            await Promise.all(
                allBlogPosts.map(async (blogPost) => {
                    const { metadata } = blogPost;
                    const relatedPosts = getRelatedPosts(allBlogPosts, metadata);
                    await createData(
                        // Note that this created data path must be in sync with
                        // metadataPath provided to mdx-loader.
                        `${utils.docuHash(metadata.source)}.json`,
                        JSON.stringify({ ...metadata, relatedPosts }, null, 2)
                    );
                })
            );
        },
    };
}

module.exports = {
    ...blogPluginExports,
    default: blogPluginExtended,
};
