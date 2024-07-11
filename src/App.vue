<template>
  <div class="story">
    <h1>{{ currentScene.title }}</h1>
    <p v-for="p in currentScene.description">{{ p }}</p>
    <button
      class="action-button"
      v-for="a in currentScene.actions"
      :key="a[0] + currentScene.title"
      @click="engine.runExpr(a[0])"
    >
      {{ a[1] }}
    </button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { currentScene, engine } from "./engine.ts";

onMounted(() => {
  console.log("hello from vue!");
});
</script>

<style scoped>
.story {
  max-width: 64ch;
  margin: 0 auto;
  padding-top: 4em;
}

.action-button {
  border: solid 1px black;
  padding: 0.2em;
  width: 100%;
}
</style>
