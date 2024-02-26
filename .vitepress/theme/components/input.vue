<template>
   <input
      type="text"
      v-bind="$attrs"
      :value="props.value"
      @input="(e) => {
      $emit('update:value', (e.target as any).value);
   }"
   />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useData } from "vitepress";

const { isDark } = useData();

const props = withDefaults(
   defineProps<{
      value?: string;
   }>(),
   {
      value: () => "",
   }
);
</script>

<style lang="scss" scoped>
input {
   font-size: 1rem;
   font-family: var(--vp-font-family-base);

   padding: 5px 10px;
   border-radius: 5px;
   background: v-bind("isDark ? 'rgba(120, 120, 120, 0.1)' : 'white'");
   box-shadow: v-bind("isDark ? '' : '0 0 0 1px rgba(0, 0, 0, 0.1)'");

   &:hover {
      box-shadow: 0 0 0px 1px var(--vp-c-brand-1);
   }

   &:focus-within {
      box-shadow: 0 0 0px 1px var(--vp-c-brand-1);
   }
}
</style>
