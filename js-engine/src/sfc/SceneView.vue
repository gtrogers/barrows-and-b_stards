<template>
  <Transition appear mode="out-in">
    <div :key="currentScene.title" class="story">
      <p v-for="p in currentScene.description">{{ p }}</p>
      <hr />
      <button
        class="action-button left"
        v-for="a in currentScene.actions"
        :key="a[0] + currentScene.title"
        @click="engine.runExpr(a[0])"
      >
        {{ a[1] }}
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { currentScene, engine } from "../engine.ts";
</script>

<style scoped>
.story {
  max-width: 64ch;
  margin: 0 auto;
  padding-top: 4em;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
