// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'ZenStack',
    url: 'https://zenstack.dev',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/logo.png',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'zenstackhq', // Usually your GitHub org/user name.
    projectName: 'zenstack', // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    path: 'docs',
                    editUrl: 'https://github.com/zenstackhq/zenstack-docs/edit/main',
                    lastVersion: 'current',
                    versions: {
                        current: {
                            label: '3.x',
                            banner: 'none',
                        },
                        '2.x': {
                            label: '2.x',
                            banner: 'none',
                        },
                    },
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                sitemap: {
                    changefreq: 'weekly',
                },
                googleTagManager: {
                    containerId: 'GTM-M3DK97B',
                },
            },
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        {
            announcementBar: {
                id: 'zenstack_studio',
                content:
                    '<span class="mr-2">⚡</span>Explore your database the modern way with <strong>ZenStack Studio.</strong> <a href="https://studio.zenstack.dev/" style="margin-left:6px">Try it out →</a>',
                isCloseable: true,
            },
            colorMode: {
                defaultMode: 'light',
                respectPrefersColorScheme: false,
            },

            metadata: [
                {
                    name: 'keywords',
                    content:
                        'authorization,auth,prisma,orm,web development,webdev,full-stack,api,type-safe,acl,rls,saas,ai',
                },
                {
                    name: 'description',
                    content:
                        'A schema-first TypeScript toolkit that enhances Prisma ORM with flexible Authorization and auto-generated, type-safe APIs/hooks, simplifying full-stack development and AI friendly',
                },
            ],

            navbar: {
                title: 'ZenStack',
                logo: {
                    alt: 'ZenStack Logo',
                    src: 'img/logo.png',
                    srcDark: 'img/logo-dark.png',
                },
                items: [
                    {
                        to: '/docs/',
                        position: 'left',
                        label: 'Get Started',
                        activeBaseRegex: '^/docs/?$',
                    },
                    {
                        to: '/docs/category/reference',
                        position: 'left',
                        label: 'Reference',
                    },
                    { to: '/blog', label: 'Blog', position: 'left' },
                    {
                        href: 'https://github.com/zenstackhq/zenstack',
                        label: 'GitHub',
                        position: 'right',
                    },
                    {
                        href: 'https://discord.gg/Ykhr738dUe',
                        label: 'Discord',
                        position: 'right',
                    },
                    {
                        type: 'docsVersionDropdown',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Get Started',
                                to: '/docs',
                            },
                            {
                                label: 'Reference',
                                to: '/docs/category/reference',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Discord',
                                href: 'https://discord.gg/Ykhr738dUe',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/zenstackhq',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Blog',
                                to: '/blog',
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/zenstackhq/zenstack',
                            },
                        ],
                    },
                    {
                        title: 'FlatIcon Credits',
                        items: [
                            {
                                label: 'Endure',
                                href: 'https://www.flaticon.com/free-icons/endure',
                            },
                            {
                                label: 'Diagram by Kiranshastry',
                                href: 'https://www.flaticon.com/free-icons/diagram',
                            },
                            {
                                href: 'https://www.flaticon.com/free-icons/database',
                                label: 'Database by kerismaker',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} ZenStack, Inc.`,
            },

            image: '/img/social-cover.png',

            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ['json', 'tsx'],
            },

            zoom: {
                config: {
                    // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
                    background: {
                        light: 'rgb(255, 255, 255)',
                        dark: 'rgb(50, 50, 50)',
                    },
                },
            },

            algolia: {
                // The application ID provided by Algolia
                appId: 'VS0AELD3AC',

                // Public API key: it is safe to commit it
                apiKey: 'f7aefaa5e0f6ff7d3816023e35d1503c',

                indexName: 'zenstack',

                // Optional: see doc section below
                contextualSearch: true,

                // Optional: Algolia search parameters
                searchParameters: {},

                // Optional: path for search page that enabled by default (`false` to disable it)
                searchPagePath: 'search',
            },

            tableOfContents: {
                maxHeadingLevel: 4,
            },
        },

    plugins: [
        async function myPlugin(context, options) {
            return {
                name: 'docusaurus-tailwindcss',
                configurePostCss(postcssOptions) {
                    // Appends TailwindCSS and AutoPrefixer.
                    postcssOptions.plugins.push(require('tailwindcss'));
                    postcssOptions.plugins.push(require('autoprefixer'));
                    return postcssOptions;
                },
            };
        },
        [
            './src/plugins/blog-plugin.js',
            {
                showReadingTime: true,
                blogSidebarTitle: 'Recent posts',
                blogSidebarCount: 10,
            },
        ],
    ],

    markdown: {
        mermaid: true,
    },

    themes: ['@docusaurus/theme-mermaid'],
};

module.exports = config;
