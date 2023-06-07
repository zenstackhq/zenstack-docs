module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
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
        },
        maxWidth: {
            '1/4': '25%',
            '1/3': '33%',
            '1/2': '300px',
            '3/4': '75%',
        },
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    darkMode: ['class', '[data-theme="dark"]'],
    corePlugins: { preflight: false },
};
