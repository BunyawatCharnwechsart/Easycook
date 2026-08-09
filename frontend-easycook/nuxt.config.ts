import tailwindcss from "@tailwindcss/vite";
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
    app:{
        head:{
            link:[
                {rel: 'icon', type: 'image/png', href: '/logo.png'}
            ]
        }
    },
    compatibilityDate: '2025-07-15',
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    css: ['./app/assets/css/main.css'],
    vite: {
        plugins:
            [tailwindcss()]
        },
    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/ui'
    ],
        runtimeConfig: {
            public: {
                apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'https://backend_easycook.bunyawat.workers.dev'
            }
        },
        hooks: {
        'pages:extend' (pages) {
        function setMiddleware (pages: NuxtPage[]) {
            for (const page of pages) {
            if (page.path?.startsWith('/app/recipe')) {
                page.meta ||= {}
                // Note that this will override any middleware set in `definePageMeta` in the page
                page.meta.middleware = ['auth']
            }
            if (page.children) {
                setMiddleware(page.children)
            }
            }
        }
        setMiddleware(pages)
        },
    },
})
