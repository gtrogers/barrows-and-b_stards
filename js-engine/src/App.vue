<template>
  <div class="wrapper">
    <component :is="activeView" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { currentScene, engine, activeView } from "./engine.ts";
import SceneView from "./sfc/SceneView.vue";
</script>

<style scoped>
.wrapper {
  max-width: 64ch;
  margin: 0 auto;
  padding-top: 4em;
}
</style>
