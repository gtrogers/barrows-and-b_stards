<template>
  <h1>Barrows & B'stards</h1>
  <div class="button-group">
    <button class="action-button" @click="engine.newGame()">New Game</button>
    <button class="action-button">Load</button>
    <a class="action-button" href="#">GitHub</a>
  </div>
</template>

<script setup>
import { engine } from "../engine.ts";
</script>

<style scoped></style>
