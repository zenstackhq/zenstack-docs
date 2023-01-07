module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        maxWidth: {
            '1/4': '25%',
            '1/3': '33%',
            '1/2': '300px',
            '3/4': '75%',
        },
    },
    plugins: [],
    darkMode: ['class', '[data-theme="dark"]'],
    corePlugins: { preflight: false },
};
