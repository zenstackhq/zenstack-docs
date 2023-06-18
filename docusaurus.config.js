// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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
            colorMode: {
                defaultMode: 'light',
                disableSwitch: true,
                respectPrefersColorScheme: false,
            },

            metadata: [
                {
                    name: 'keywords',
                    content: 'prisma,orm,web development,webdev,full-stack',
                },
                {
                    name: 'description',
                    content:
                        'ZenStack adds the missing access control layer to the awesome Prisma ORM and unleashes its full potential for full-stack development.',
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
                        to: 'docs/intro',
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
                        href: 'https://github.com/zenstackhq/zenstack',
                        label: 'GitHub',
                        position: 'right',
                    },
                    {
                        href: 'https://go.zenstack.dev/chat',
                        label: 'Discord',
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
                                to: '/docs/intro',
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
                                href: 'https://go.zenstack.dev/chat',
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
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
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
        },

    plugins: [
        // require.resolve('docusaurus-plugin-image-zoom'),
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
};

module.exports = config;
