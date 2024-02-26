<template>
   <div class="card">
      <div class="header">
         <span class="title">
            {{ props.title }}
         </span>
         <slot name="header"></slot>
      </div>
      <div class="body">
         <slot name="default"></slot>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";

const { isDark } = useData();

const props = withDefaults(
   defineProps<{
      title?: string;
   }>(),
   {
      title: () => "Card Title",
   }
);
</script>

<style lang="scss" scoped>
.card {
   font-size: 1rem;
   font-family: var(--vp-font-family-base);

   border-radius: 5px;
   background: v-bind("isDark ? 'rgba(120, 120, 120, 0.1)' : 'white'");
   box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);

   display: flex;
   flex-direction: column;

   .header {
      width: 100%;
      padding: 20px;

      display: flex;
      flex-direction: row;
      align-items: center;

      .title {
         font-weight: 500;
      }
   }

   .body {
      padding: 20px;
      padding-top: 0px;
   }
}
</style>
