<template>
   <div v-html="renderedMarkdown"></div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import MarkdownIt from "markdown-it";
import MarkdownMath from "markdown-it-mathjax3";
const md = new MarkdownIt();
md.use(MarkdownMath);

const slots = defineSlots<{
   default: () => void;
}>();

const renderedMarkdown = ref("");

const renderMarkdown = () => {
   const markdownContent = getContent();
   renderedMarkdown.value = md.render(markdownContent);
};

const getContent = () => {
   if (slots.default) {
      return slots.default()[0].children;
   } else {
      return "";
   }
};

watchEffect(() => {
   renderMarkdown();
});

renderMarkdown();
</script>
