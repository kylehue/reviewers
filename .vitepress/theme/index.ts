import "./styles/main.css";
import "./styles/tailwind.postcss";
import DefaultTheme from "vitepress/theme";
import Quiz from "./components/quiz.vue";
import Markdown from "./components/markdown.vue";
import SpoilerReveal from "./components/spoiler-reveal.vue";
import Scrambler from "./components/scrambler.vue";
import FloatingButtonContainer from "./components/floating-button-container.vue";
import { Theme } from "vitepress";

export default {
   extends: DefaultTheme,
   enhanceApp({ app }) {
      app.component("Quiz", Quiz);
      app.component("Markdown", Markdown);
      app.component("SpoilerReveal", SpoilerReveal);
      app.component("Scrambler", Scrambler);
      app.component("FloatingButtonContainer", FloatingButtonContainer);
   },
} as Theme;
