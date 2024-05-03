import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  outDir: "../public/docs",
  base: "/docs/",
  lang: "en-US",
  title: "Pleb Rewards",
  description: "Vite & Vue powered static site generator.",
  themeConfig: {
    nav: [

    ],
    sidebar: [
      {
        text: "Twitch Rewards",
        collapsed: false,
        items: [
          { text: "Spotify Song Request", link: "/spotify-sr" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Yizack/plebrewards" }
    ]
  }
});
