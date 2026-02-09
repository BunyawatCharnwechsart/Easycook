// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    app:{
        head:{
            link:[
                {rel: 'icon', type: 'image/png', href: '/logo.png'}
            ]
        }
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['./app/assets/css/main.css'],
    vite: {
        plugins:
            [tailwindcss()]
    },
    modules: [
        '@nuxt/content',
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/ui'
    ],
    runtimeConfig: {
        public: {
            apiBase: ''
        }
    }
})
