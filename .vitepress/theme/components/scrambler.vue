<template>
   <Button
      class="medium alt !p-3 w-fit h-fit m-0"
      @click="() => (isScrambled = !isScrambled)"
   >
      <PhShuffle v-if="!isScrambled" :size="20"></PhShuffle>
      <PhRepeat v-else :size="20"></PhRepeat>
   </Button>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { PhShuffle, PhRepeat } from "@phosphor-icons/vue";
import Button from "./button.vue";
import { shuffleArray } from "../utils/common";

const props = withDefaults(
   defineProps<{
      tag?: keyof HTMLElementTagNameMap;
      dividers?: (keyof HTMLElementTagNameMap)[];
      includeLists?: boolean;
   }>(),
   {
      includeLists: () => true,
      dividers: () => ["h2"],
      tag: () => "h3",
   }
);

let dividers = computed(() => new Set(props.dividers as string[]));
let isScrambled = ref(false);
let all: HTMLElement[][][] = [];
let parentOfAll: HTMLElement | null = null;
let allLists: [HTMLUListElement, HTMLLIElement[]][] = [];

watch(isScrambled, (v) => toggleScramble(v));

function toggleScramble(doScramble: boolean) {
   if (parentOfAll === null) {
      console.warn(
         "Couldn't scramble content because the main parent is not found."
      );
      return;
   }

   // Prepare scrambling/unscrambling by removing all elements
   for (let sections of all) {
      for (let section of sections) {
         for (let element of section) {
            element.remove();
         }
      }
   }

   // Re-add all elements
   for (let division of all) {
      if (doScramble) {
         // If the first section in division is a divider element, always
         // make it the first section.
         if (dividers.value.has(division[0]?.[0]?.tagName.toLowerCase())) {
            division = [
               division[0],
               ...shuffleArray(Array.from(division.slice(1))),
            ];
         } else {
            division = shuffleArray(Array.from(division));
         }
      }

      for (let section of division) {
         for (let element of section) {
            parentOfAll.appendChild(element);
         }
      }
   }

   // What about the lists?
   if (props.includeLists) {
      if (doScramble) {
         for (let [parent, children] of allLists) {
            for (let li of shuffleArray(Array.from(children))) {
               parent.appendChild(li);
            }
         }
      } else {
         for (let [parent, children] of allLists) {
            for (let li of children) {
               parent.appendChild(li);
            }
         }
      }
   }
}

function initContent() {
   let rawSections = Array.from(
      document.querySelectorAll<HTMLElement>(`.vp-doc ${props.tag}`)
   );

   // Get all sections first
   let undividedSections: HTMLElement[][] = [];
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
      undividedSections.push(currentGroup);
   }

   // Then get the divided sections
   let currentDivison: HTMLElement[][] = [];
   let currentSection: HTMLElement[] = [];
   for (let section of undividedSections) {
      for (let i = 0; i < section.length; i++) {
         let element = section[i];

         // Split if element is a divider
         if (dividers.value.has(element.tagName.toLowerCase())) {
            currentDivison.push(currentSection);
            all.push(currentDivison);
            currentDivison = [];
            currentSection = section.slice(i);
            break;
         }

         currentSection.push(element);
      }

      currentDivison.push(currentSection);
      currentSection = [];
   }

   if (currentDivison.length) all.push(currentDivison);

   parentOfAll = all[0]?.[0]?.[0].parentElement;

   // Lastly, get all lists
   if (props.includeLists) {
      let uls = document.querySelectorAll<HTMLUListElement>(".vp-doc ul");
      for (let ul of uls) {
         allLists.push([ul, Array.from(ul.querySelectorAll("li"))]);
      }
   }
}

onMounted(() => {
   initContent();
});

onBeforeUnmount(() => {
   isScrambled.value = false;
   all = [];
   allLists = [];
   parentOfAll = null;
});
</script>
