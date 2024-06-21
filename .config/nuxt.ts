import { SITE } from "../utils/site";

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      link: [
        { rel: "preload", href: "/fonts/Fredoka-Regular.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/Fredoka-Medium.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/Fredoka-SemiBold.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" },
      ],
      meta: [
        { name: "robots", content: "index, follow" }
      ]
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/main.css",
    "~/assets/css/transitions.css",
    "~/assets/css/navbar.css",
    "~/assets/css/buttons.css",
    "~/assets/css/theme-dark.css"
  ],
  modules: [
    "@nuxt/eslint",
    "nuxt-icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "nuxt-auth-utils",
    "nuxt-webhooks-validator"
  ],
  eslint: {
    config: {
      autoInit: false
    }
  },
  runtimeConfig: {
    webhooks: {
      twitch: {
        secretKey: ""
      }
    }
  },
  features: {
    inlineStyles: false
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  site: {
    url: SITE.url.prod
  },
  nitro: {
    imports: {
      dirs: [
        "server/utils/rewards/**"
      ]
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/docs/*"]
        }
      }
    },
    prerender: {
      routes: ["/sitemap.xml"],
    }
  },
  sitemap: {
    dynamicUrlsApiEndpoint: "/__sitemap",
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },
  routeRules: {
    "/": { sitemap: { priority: 1 }},
    "/*/**": { sitemap: { priority: 0.8, lastmod: new Date().toISOString() } }
  }
});
