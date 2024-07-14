import { reactive, computed, ref } from "vue";
import { renderScene } from "./scene.ts";
import type { SceneTemplate, Scene, StateItem } from "./scene.ts";
import { parseAndRun } from "./expressions.ts";

import gamefile from "../../story/game.advm.json";

import Welcome from "./sfc/Welcome.vue";
import Story from "./sfc/SceneView.vue";
import PartyCreator from "./sfc/PartyCreator.vue";

const scenes = gamefile;
const state = new Map();
const activeTemplate = reactive<SceneTemplate>({
  ...(gamefile.scenes.intro as SceneTemplate),
});
export const currentScene = computed<Scene>(() => {
  // TODO - typescript really dislikes the recursive types here, perhaps they can be simplified?
  // @ts-ignore
  return renderScene(activeTemplate, state);
});

const views = {
  welcome: Welcome,
  story: Story,
  partyCreator: PartyCreator,
};

type View = keyof typeof views;
const currentView = ref<View>("welcome");

export const activeView = computed(() => views[currentView.value]);

export interface Engine {
  runExpr: (expr: string) => void;
  set: (k: string, v: StateItem) => void;
  loadScene: (name: string) => void;
  newGame: () => void;
  gotoScreen: (screenName: View) => void;
}

/***
 * Update the properties on the active scene template with the values
 * from the new scene template.
 *
 * N.B - we have to update properties to maintain the Vue's reactivity.
 ***/
function swapScene(slug: string) {
  console.log("Swapping scene: " + slug);
  // TODO: proper scene management - where does the scenefile come from?
  const newScene = scenes.scenes[slug];
  activeTemplate.title = newScene.title;
  activeTemplate.description = newScene.description;
}

export const engine: Engine = {
  runExpr(expr: string) {
    parseAndRun(expr, this);
  },
  set(k: string, v: StateItem) {
    state.set(k, v);
  },
  loadScene(name: string) {
    swapScene(name);
  },
  newGame() {
    currentView.value = "partyCreator";
  },
  gotoScreen(screen: View) {
    const newView = views[screen];
    if (!newView) {
      throw new Error("No such view " + screen);
    }
    currentView.value = screen;
  }
};
