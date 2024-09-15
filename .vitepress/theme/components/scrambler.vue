<template>
   <Button class="medium alt !p-3 w-fit h-fit m-0" @click="toggleScramble">
      <PhShuffle v-if="!isScrambled" :size="20"></PhShuffle>
      <PhRepeat v-else :size="20"></PhRepeat>
   </Button>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { PhShuffle, PhRepeat } from "@phosphor-icons/vue";
import Button from "./button.vue";
import { shuffleArray } from "../utils/common";

const props = withDefaults(
   defineProps<{
      tag: keyof HTMLElementTagNameMap;
      includeLists?: boolean;
   }>(),
   {
      includeLists: () => true,
   }
);

let isScrambled = ref(false);
let sectionContentParents: HTMLElement[] = [];
let sectionContent: HTMLElement[][] = [];
let listContentParents: HTMLElement[] = [];
let listContent: HTMLElement[][] = [];

const toggleScramble = () => {
   if (!isScrambled.value) {
      scramble();
   } else {
      unscramble();
   }
   isScrambled.value = !isScrambled.value;
};

function removeContent() {
   for (let i = 0; i < sectionContent.length; i++) {
      for (let j = 0; j < sectionContent[i].length; j++) {
         sectionContent[i][j].remove();
      }
   }
}

function scramble() {
   removeContent();
   for (let i of shuffleArray(Array.from(sectionContent.keys()))) {
      for (let j = 0; j < sectionContent[i].length; j++) {
         sectionContentParents[i].appendChild(sectionContent[i][j]);
      }
   }
   for (let i of shuffleArray(Array.from(listContent.keys()))) {
      let shuffledJ = shuffleArray(Array.from(listContent[i].keys()));
      for (let j of shuffledJ) {
         listContentParents[i].appendChild(listContent[i][j]);
      }
   }
}

function unscramble() {
   removeContent();
   for (let i = 0; i < sectionContent.length; i++) {
      for (let j = 0; j < sectionContent[i].length; j++) {
         sectionContentParents[i].appendChild(sectionContent[i][j]);
      }
   }
   for (let i = 0; i < listContent.length; i++) {
      for (let j = 0; j < listContent[i].length; j++) {
         listContentParents[i].appendChild(listContent[i][j]);
      }
   }
}

function initContent() {
   let rawSections = Array.from(
      document.querySelectorAll<HTMLElement>(`.vp-doc ${props.tag}`)
   );
   for (let i = 0; i < rawSections.length; i++) {
      let currentGroup: HTMLElement[] = [rawSections[i]];
      let currentEl = rawSections[i];
      while (
         currentEl.nextElementSibling !== null &&
         currentEl.nextElementSibling !== rawSections[i + 1]
      ) {
         currentGroup.push(currentEl.nextElementSibling as HTMLElement);
         currentEl = currentEl.nextElementSibling as HTMLElement;
      }
      sectionContent.push(currentGroup);
      sectionContentParents.push(currentGroup[0].parentElement!);
   }

   if (props.includeLists) {
      let rawLists = Array.from(
         document.querySelectorAll<HTMLElement>(".vp-doc ul")
      );
      for (let i = 0; i < rawLists.length; i++) {
         let currentGroup = Array.from(rawLists[i].children) as HTMLElement[];
         listContent.push(currentGroup);
         listContentParents.push(rawLists[i]);
      }
   }
}

onMounted(() => {
   initContent();
});

onBeforeUnmount(() => {
   unscramble();
   sectionContentParents = [];
   sectionContent = [];
   listContentParents = [];
   listContent = [];
});
</script>
