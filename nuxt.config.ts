// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    // experimental: {
    // appManifest: false,
    // },

    runtimeConfig: {
        public: {
            directusUrl: process.env.DIRECTUS_URL,
        },
    },

    devtools: { enabled: true },

    devServer: {
        port: 4000,
    },

    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap',
                },
            ],
        },
    },

    // css: ['~/assets/main.scss'],
    css: ['~/assets/css/app.css'],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    modules: [
        "@pinia/nuxt",
        'pinia-plugin-persistedstate/nuxt',
        '@nuxtjs/i18n',
        '@nuxt/icon'
    ],

    i18n: {
        vueI18n: './i18n.config.ts',
        strategy: 'no_prefix',
        // strategy: 'prefix_except_default',
        locales: ['en', 'fr'],
        defaultLocale: 'fr',
        // lazy: true,
        // dynamicRouteParams: true,
        // legacy: false,
        // langDir: 'lang',
        // messages
    },

    router: {
        options: { linkExactActiveClass: 'active' },
    },

})