import { defineConfig } from "vitepress";
import MarkdownMath from "markdown-it-texmath";

const customElements = ["eq", "eqn"];

// https://vitepress.dev/reference/site-config
export default defineConfig({
   title: "Reviewers",
   description: "Compilation of reviewers from a variety of subjects.",
   themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
         { text: "Home", link: "/" },
         { text: "Get Started", link: "/subjects/" },
      ],
      sidebar: [
         {
            text: "Index",
            link: "/subjects/index",
         },
         {
            text: "CS 201A (Data Structures and Algorithms)",
            link: "/subjects/cs201a/",
         },
         {
            text: "ITE 005 (Operating Systems)",
            link: "/subjects/ite005/",
         },
      ],
      editLink: {
         pattern: "https://github.com/kylehue/reviewers/tree/main/:path",
         text: "Suggest changes to this page",
      },
      socialLinks: [
         { icon: "github", link: "https://github.com/kylehue/reviewers" },
      ],
      search: {
         provider: "local",
      },
   },
   base: "/reviewers/",
   head: [
      [
         "link",
         {
            rel: "stylesheet",
            href: "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css",
            integrity:
               "sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww",
            crossorigin: "anonymous",
         },
      ],
   ],
   ignoreDeadLinks: true,
   markdown: {
      math: false,
      config(md) {
         md.use(MarkdownMath);
      },
   },
   vue: {
      template: {
         compilerOptions: {
            isCustomElement: (tag) => customElements.includes(tag),
         },
      },
   },
});
