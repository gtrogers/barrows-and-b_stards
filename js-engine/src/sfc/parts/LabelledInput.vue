<template>
  <div class="input-wrapper">
    <label :for="id">{{ label }}</label
    ><input :minx="min" :max="max" :id="id" :type="type" v-model="model" />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  type: String,
  label: String,
  min: Number,
  max: Number,
});

const model = defineModel();
</script>

<style scoped>
label {
  padding-right: 1em;
  text-transform: capitalize;
}

input[type="number"] {
  max-width: 4em;
  float: right;
  margin-right: 5em;
}
</style>
