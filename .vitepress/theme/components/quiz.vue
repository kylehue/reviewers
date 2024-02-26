<template>
   <div class="quiz">
      <template v-for="question of questions">
         <QuestionVue :question="question"></QuestionVue>
      </template>
   </div>
</template>

<script lang="ts" setup>
import QuestionVue from "./question.vue";
import { useData } from "vitepress";
import type { Question } from "../../../types";

const { isDark } = useData();

const props = defineProps<{
   questions: Question[];
}>();
</script>

<style lang="scss" scoped>
.quiz {
   display: flex;
   flex-direction: column;
   gap: 10px;
}
</style>
