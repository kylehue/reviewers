import "./styles/main.css";
import DefaultTheme from "vitepress/theme";
import Quiz from "./components/quiz.vue";

/** @type {import('vitepress').Theme} */
export default {
   extends: DefaultTheme,
   enhanceApp({ app }) {
      app.component("Quiz", Quiz);
   },
};
