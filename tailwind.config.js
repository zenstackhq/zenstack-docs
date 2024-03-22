module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', 'docusaurus.config.js'],
    theme: {
        container: {
            center: true,
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                primary: {
                    dark: 'var(--ifm-color-primary-dark)',
                    darker: 'var(--ifm-color-primary-darker)',
                    darkest: 'var(--ifm-color-primary-darkest)',
                    DEFAULT: 'var(--ifm-color-primary)',
                    light: 'var(--ifm-color-primary-light)',
                    lighter: 'var(--ifm-color-primary-lighter)',
                    lightest: 'var(--ifm-color-primary-lightest)',
                },
            },
            keyframes: {
                'slide-left': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                'slide-right': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            },
            animation: {
                'infinite-carousel-left': 'slide-left 18s linear infinite',
                'infinite-carousel-right': 'slide-right 18s linear infinite',
            },
            backgroundImage: {
                'carousel-gradient-x':
                    'linear-gradient(to right, rgb(0 0 0) calc(0% + 2rem), rgba(255,255,255,0) calc(0% + 6.25rem), rgba(255,255,255,0) calc(100% - 6.25rem), rgb(0 0 0) calc(100% - 2rem))',
            },
        },
        maxWidth: {
            '1/4': '25%',
            '1/3': '33%',
            '1/2': '300px',
            '3/4': '75%',
        },
    },
    plugins: [require('@tailwindcss/typography')],
    darkMode: ['class', '[data-theme="dark"]'],
    corePlugins: { preflight: false },
};
