import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  outDir: "../public/docs",
  base: "/docs/",
  lang: "en-US",
  title: "Pleb Rewards",
  description: "Pleb Rewards for your Twitch Channel",
  cleanUrls: true,
  themeConfig: {
    nav: [

    ],
    sidebar: [
      {
        text: "Twitch Rewards",
        collapsed: false,
        items: [
          { text: "Spotify Song Requests", link: "/rewards/spotify-sr" }
        ]
      },
      {
        text: "Connections",
        collapsed: false,
        items: [
          { text: "Spotify", link: "/connections/spotify" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Yizack/plebrewards" }
    ],
    editLink: {
      pattern: "https://github.com/Yizack/plebrewards/edit/main/docs/:path",
      text: "Edit this page on GitHub"
    },
    search: {
      provider: "local"
    }
  }
});
