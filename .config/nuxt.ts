import { SITE } from "../app/utils/site";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "nuxt-auth-utils",
    "nuxt-webhook-validators",
    "@nuxthub/core"
  ],
  $production: {
    nitro: {
      preset: "cloudflare-module"
    }
  },
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
        { rel: "preload", href: "/fonts/Fredoka-SemiBold.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" }
      ],
      meta: [
        { name: "robots", content: "index, follow" }
      ]
    }
  },
  css: [
    "~/assets/scss/app.scss"
  ],
  site: {
    url: SITE.url.prod
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  runtimeConfig: {
    webhook: {
      twitch: {
        secretKey: ""
      }
    }
  },
  routeRules: {
    "/": { sitemap: { priority: 1 } },
    "/*/**": { sitemap: { priority: 0.8, lastmod: new Date().toISOString() } },
    "/app/**": { index: false },
    "/api/_nuxt_icon/**": { cache: { maxAge: 1.577e+7 } }
  },
  features: {
    inlineStyles: false
  },
  compatibilityDate: "2025-12-24",
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
      routes: ["/sitemap.xml"]
    }
  },
  hub: {
    db: {
      dialect: "sqlite"
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["color-functions", "import", "global-builtin", "if-function"]
        }
      }
    }
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  icon: {
    mode: "svg",
    clientBundle: {
      scan: true,
      sizeLimitKb: 2048
    }
  },
  sitemap: {
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  }
});
