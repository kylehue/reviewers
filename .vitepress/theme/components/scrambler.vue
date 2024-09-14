<template>
   <Button class="medium alt !p-3 w-fit h-fit m-0" @click="toggleScramble">
      <PhShuffle v-if="!isScrambled" :size="20"></PhShuffle>
      <PhRepeat v-else :size="20"></PhRepeat>
   </Button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PhShuffle, PhRepeat } from "@phosphor-icons/vue";
import Button from "./button.vue";
import { shuffleArray } from "../utils/common";

const props = defineProps<{
   tag: string;
}>();

let isScrambled = ref(false);
let parent: HTMLElement | null = null;
let content: HTMLElement[][] = [];

const toggleScramble = () => {
   if (!isScrambled.value) {
      scrambleSections();
   } else {
      restoreOriginalOrder();
   }
   isScrambled.value = !isScrambled.value;
};

function removeContent() {
   for (let i = 0; i < content.length; i++) {
      for (let j = 0; j < content[i].length; j++) {
         content[i][j].remove();
      }
   }
}

function scrambleSections() {
   removeContent();
   let randomized = shuffleArray(Array.from(content.keys()));
   for (let index of randomized) {
      for (let j = 0; j < content[index].length; j++) {
         parent?.appendChild(content[index][j]);
      }
   }
}

// Function to restore the original order (reloading page content)
function restoreOriginalOrder() {
   removeContent();
   for (let i = 0; i < content.length; i++) {
      for (let j = 0; j < content[i].length; j++) {
         parent?.appendChild(content[i][j]);
      }
   }
}

onMounted(() => {
   let ungroupedContent = Array.from(
      document.querySelectorAll<HTMLElement>(props.tag)
   );
   for (let i = 0; i < ungroupedContent.length; i++) {
      let currentGroup: HTMLElement[] = [ungroupedContent[i]];
      let currentEl = ungroupedContent[i];
      while (
         currentEl.nextElementSibling !== null &&
         currentEl.nextElementSibling !== ungroupedContent[i + 1]
      ) {
         currentGroup.push(currentEl.nextElementSibling as HTMLElement);
         currentEl = currentEl.nextElementSibling as HTMLElement;
      }
      content.push(currentGroup);
   }

   parent = ungroupedContent[0].parentElement;
});
</script>
