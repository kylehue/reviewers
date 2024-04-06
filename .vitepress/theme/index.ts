import "./styles/main.css";
import "./styles/tailwind.postcss";
import DefaultTheme from "vitepress/theme";
import Quiz from "./components/quiz.vue";
import Markdown from "./components/markdown.vue";

/** @type {import('vitepress').Theme} */
export default {
   extends: DefaultTheme,
   enhanceApp({ app }) {
      app.component("Quiz", Quiz);
      app.component("Markdown", Markdown);
   },
};
