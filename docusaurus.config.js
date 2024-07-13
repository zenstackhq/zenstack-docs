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
                            label: '2.x',
                            banner: 'none',
                        },
                        '1.x': {
                            label: '1.x',
                            banner: 'none',
                        },
                    },
                },
                blog: {
                    showReadingTime: true,
                    blogSidebarTitle: 'Recent posts',
                    blogSidebarCount: 10,
                },
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
                id: 'v2_announcement',
                content: '🎉 <a href="/blog/v2-stories">ZenStack V2</a> is released 🥳️!',
            },

            colorMode: {
                defaultMode: 'light',
                respectPrefersColorScheme: false,
            },

            metadata: [
                {
                    name: 'keywords',
                    content:
                        'authorization,auth,prisma,orm,web development,webdev,full-stack,api,type-safe,acl,rls,saas',
                },
                {
                    name: 'description',
                    content:
                        'A TypeScript toolkit that enhances Prisma ORM with flexible Authorization and auto-generated, type-safe APIs/hooks, simplifying full-stack development',
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
                        to: 'docs/welcome',
                        position: 'left',
                        label: 'Get Started',
                    },
                    {
                        to: 'docs/category/reference',
                        position: 'left',
                        label: 'Reference',
                    },
                    { to: '/blog', label: 'Blog', position: 'left' },
                    {
                        href: 'https://discord.gg/Ykhr738dUe',
                        label: 'Discord',
                        position: 'right',
                    },
                    {
                        type: 'docsVersionDropdown',
                        position: 'right',
                    },
                    {
                        type: 'html',
                        position: 'left',
                        value: `<div id="github-button">
                        <a href='https://github.com/zenstackhq/zenstack' class="inline-flex items-center justify-center space-x-0 rounded-md text-sm  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 group bg-gray-900 hover:bg-gray-950 transition-all duration-200 ease-in-out hover:ring-2 hover:ring-offset-2 hover:ring-gray-900 hover:no-underline">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="mr-2 text-white"
                            >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                <path d="M9 18c-4.51 2-5-2-7-2"></path>
                            </svg>
                            <span id="github-text" class="text-white pr-2">Star on Github</span>
                            <span class="flex items-center ml-2 group-hover:text-yellow-500 transition-colors duration-200 ease-in-out">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class=" text-yellow-500"
                                >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </span>
                        </a>
                    </div>`,
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
                                to: '/docs/welcome',
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
                ],
                copyright: `Copyright © ${new Date().getFullYear()} ZenStack, Inc.`,
            },

            image: '/img/social-cover.png',

            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ['json'],
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
    ],

    markdown: {
        mermaid: true,
    },

    themes: ['@docusaurus/theme-mermaid'],
};

module.exports = config;
