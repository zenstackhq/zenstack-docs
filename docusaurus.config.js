// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'ZenStack',
    tagline: '⚡️ Fast Lane From Frontend To Database',
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
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    path: 'docs',
                },
                // blog: {
                //     showReadingTime: true,
                // },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
        [
            'docusaurus-preset-shiki-twoslash',
            {
                themes: ['min-light', 'nord'],
            },
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'ZenStack',
                logo: {
                    alt: 'ZenStack Logo',
                    src: 'img/logo.png',
                    srcDark: 'img/logo-dark.png',
                },
                items: [
                    {
                        to: 'docs/',
                        position: 'left',
                        label: 'Get Started',
                    },
                    {
                        to: 'docs/category/reference',
                        position: 'left',
                        label: 'Reference',
                    },
                    // { to: '/blog', label: 'Blog', position: 'left' },
                    {
                        href: 'https://github.com/zenstackhq/zenstack',
                        label: 'GitHub',
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
                                href: 'https://dev.to/zenstack',
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
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),

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
};

module.exports = config;
