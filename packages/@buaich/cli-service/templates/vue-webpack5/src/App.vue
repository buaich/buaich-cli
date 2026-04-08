<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <main style="font-family: system-ui; padding: 24px">
    <h1>Bloom + Vue 3 + TS + Webpack 5</h1>
    <p>Count: {{ count }}</p>
    <button @click="count++">+1</button>
  </main>
</template>
