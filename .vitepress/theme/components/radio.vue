<template>
   <div class="radio-group">
      <template v-for="choice of choices">
         <div class="radio-item">
            <input @change="(e) => {
               if ((e.target as any).checked) {
                  $emit('update:value', choice);
               }
            }" :name="group" :id="choice" type="radio" :value="choice" />
            <label :for="choice">{{ choice }}</label>
         </div>
      </template>
   </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useData } from "vitepress";

const { isDark } = useData();

const props = withDefaults(
   defineProps<{
      group: string;
      choices: string[];
      value: string;
   }>(),
   {
      choices: () => [],
      value: () => ""
   }
);
</script>

<style lang="scss" scoped>
.radio-group {
   display: flex;
   flex-direction: column;
   justify-content: start;
   align-items: start;

   .radio-item {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
   }

   input,
   label {
      cursor: pointer;
   }

   label {
      padding: 0 10px;
   }
}
</style>
