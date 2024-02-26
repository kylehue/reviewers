<template>
   <Card :title="question.question">
      <Input v-if="question.type == 'identification'" v-model:value="value" />
      <Radio
         v-else-if="question.type == 'multiple-choice'"
         :choices="question.choices"
         :group="question.question"
         v-model:value="value"
      />
   </Card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Input from "./input.vue";
import Radio from "./radio.vue";
import Card from "./card.vue";
import type { Question } from "../../../types";

const props = defineProps<{
   question: Question;
}>();

const value = ref();

watch(() => value.value, (e) => {
   console.log(e);
});
</script>
