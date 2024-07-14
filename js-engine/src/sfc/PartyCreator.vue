<template>
  <p>Create your character.</p>
  <form>
    <fieldset>
      <legend>{{ playerOne.name }}</legend>
      <LabelledInput v-model="playerOne.name" type="text" id="name" label="Name" />
      <div class="stats-row">
        <div class="stats-col">
          <h2 class="small-heading">{{ statPointsRemaining }} points remaining</h2>
          <LabelledInput
            v-for="(v, k) in playerOne.stats"
            :min=0
            :max=5
            :id="k"
            :label="k"
            v-model="v.value"
            type="number"
          />
        </div>
        <div class="stats-col">
          <h2 class="small-heading">Skill points remaining</h2>
          <h3 class="smaller-heading">Brawn Skills</h3>
          <LabelledInput v-for="(v, k) in playerOne.stats.brawn.skills" :label="k" :id="k" :v-model="v" type="number" />
          <h3 class="smaller-heading">Brains Skills</h3>
          <LabelledInput v-for="(v, k) in playerOne.stats.brains.skills" :label="k" :id="k" :v-model="v" type="number" />
          <h3 class="smaller-heading">Coordination Skills</h3>
          <LabelledInput v-for="(v, k) in playerOne.stats.coordination.skills" :label="k" :id="k" :v-model="v" type="number" />
          <h3 class="smaller-heading">Presence Skills</h3>
          <LabelledInput v-for="(v, k) in playerOne.stats.presence.skills" :label="k" :id="k" :v-model="v" type="number" />
        </div>
      </div>
    </fieldset>
    <p>Spend all your points to continue</p>
    <button @click="() => engine.gotoScreen('story')" class="action-button" type="submit" v-if="statPointsRemaining === 0">Go forth!</button>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import { engine } from "../engine.ts";
import { newCharacter } from "../characters.ts";
import LabelledInput from "./parts/LabelledInput.vue";

const nameOne = ref("Player One");
const disc = ref(0);

const playerOne = ref(newCharacter());

const statPointsRemaining = computed(
  () =>
    9 -
    playerOne.value.stats.brawn.value -
    playerOne.value.stats.brains.value -
    playerOne.value.stats.coordination.value -
    playerOne.value.stats.presence.value
);
</script>

<style scope>
.stats-row {
  display: flex;
}

.stats-col {
  flex: 1;
}

.small-heading {
  font-size: 1.1em;
}

.smaller-heading {
  font-size: 1em;
}
</style>
