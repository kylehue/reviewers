<template>
   <button>
      <slot></slot>
   </button>
</template>

<script setup lang="ts"></script>

<!-- https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/components/VPButton.vue -->
<style scoped>
button {
   display: inline-block;
   border: 1px solid transparent;
   text-align: center;
   font-weight: 600;
   white-space: nowrap;
   transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}

button:active {
   transition: color 0.1s, border-color 0.1s, background-color 0.1s;
}

button.medium {
   border-radius: 20px;
   padding: 0 20px;
   line-height: 38px;
   font-size: 14px;
}

button.big {
   border-radius: 24px;
   padding: 0 24px;
   line-height: 46px;
   font-size: 16px;
}

button.brand {
   border-color: var(--vp-button-brand-border);
   color: var(--vp-button-brand-text);
   background-color: var(--vp-button-brand-bg);
}

button.brand:hover {
   border-color: var(--vp-button-brand-hover-border);
   color: var(--vp-button-brand-hover-text);
   background-color: var(--vp-button-brand-hover-bg);
}

button.brand:active {
   border-color: var(--vp-button-brand-active-border);
   color: var(--vp-button-brand-active-text);
   background-color: var(--vp-button-brand-active-bg);
}

button.alt {
   border-color: var(--vp-button-alt-border);
   color: var(--vp-button-alt-text);
   background-color: var(--vp-button-alt-bg);
}

button.alt:hover {
   border-color: var(--vp-button-alt-hover-border);
   color: var(--vp-button-alt-hover-text);
   background-color: var(--vp-button-alt-hover-bg);
}

button.alt:active {
   border-color: var(--vp-button-alt-active-border);
   color: var(--vp-button-alt-active-text);
   background-color: var(--vp-button-alt-active-bg);
}

button.sponsor {
   border-color: var(--vp-button-sponsor-border);
   color: var(--vp-button-sponsor-text);
   background-color: var(--vp-button-sponsor-bg);
}

button.sponsor:hover {
   border-color: var(--vp-button-sponsor-hover-border);
   color: var(--vp-button-sponsor-hover-text);
   background-color: var(--vp-button-sponsor-hover-bg);
}

button.sponsor:active {
   border-color: var(--vp-button-sponsor-active-border);
   color: var(--vp-button-sponsor-active-text);
   background-color: var(--vp-button-sponsor-active-bg);
}
</style>
