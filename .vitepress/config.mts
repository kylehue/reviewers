import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
   title: "Reviewers",
   description: "Compilation of reviewers from a variety of subjects.",
   themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
         { text: "Home", link: "/" },
         { text: "Examples", link: "/markdown-examples" },
      ],
      sidebar: [
         {
            text: "CS 201A (Data Structures and Algorithms)",
            link: "/subjects/cs201a",
         },
      ],
      socialLinks: [
         { icon: "github", link: "https://github.com/kylehue/reviewers" },
      ],
      search: {
         provider: "local",
      },
   },
});
