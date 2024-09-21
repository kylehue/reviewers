import { defineConfig } from "vitepress";
import MarkdownMath from "markdown-it-texmath";
import { spoiler } from "@mdit/plugin-spoiler";
import { withMermaid } from "vitepress-plugin-mermaid";

const customElements = ["eq", "eqn"];

// https://vitepress.dev/reference/site-config
export default withMermaid({
   ...defineConfig({
      title: "Reviewers",
      description: "Compilation of reviewers from a variety of subjects.",
      themeConfig: {
         // https://vitepress.dev/reference/default-theme-config
         nav: [
            { text: "Home", link: "/" },
            { text: "Subjects", link: "/subjects/" },
         ],
         sidebar: [
            {
               text: "Index",
               link: "/subjects/index",
            },
            {
               text: "CS 004 (Networks and Communications)",
               link: "/subjects/cs004/",
            },
            {
               text: "CS 201A (Data Structures and Algorithms)",
               link: "/subjects/cs201a/",
            },
            {
               text: "CS 300 (Automata Theory and Formal Languages)",
               link: "/subjects/cs300/",
            },
            {
               text: "CS 301 (Software Engineering I)",
               link: "/subjects/cs301/",
            },
            {
               text: "MATH 009CS (Probability and Statistics)",
               link: "/subjects/math009cs/",
            },
            {
               text: "MATH 015 (Symbolic Logic)",
               link: "/subjects/math015/",
            },
            {
               text: "PHYS 001C (Physics for Engineers)",
               link: "/subjects/phys001c/",
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
         outline: "deep",
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
         math: true,
         config(md) {
            md.use(MarkdownMath);
            // @ts-ignore
            md.use(spoiler);
         },
      },
      vue: {
         template: {
            compilerOptions: {
               isCustomElement: (tag) => customElements.includes(tag),
            },
         },
      },
      metaChunk: true,
   }),
   mermaid: {
      theme: "base",
   },
});
