<template>
   <Button class="medium alt !p-3 w-fit h-fit m-0" @click="toggleSpoilers">
      <PhEye v-if="!isActive" :size="20"></PhEye>
      <PhEyeClosed v-else :size="20"></PhEyeClosed>
   </Button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PhEye, PhEyeClosed } from "@phosphor-icons/vue";
import Button from "./button.vue";

let isActive = ref(false);

function toggleSpoilers() {
   let spoilerElements = Array.from(document.querySelectorAll("span.spoiler"));
   if (!isActive.value) {
      for (let el of spoilerElements) {
         el.classList.add("active");
      }
      isActive.value = true;
   } else {
      for (let el of spoilerElements) {
         el.classList.remove("active");
      }
      isActive.value = false;
   }
}
</script>
