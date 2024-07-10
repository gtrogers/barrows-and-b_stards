import { reactive, computed } from "vue";
import { renderScene, EMPTY_SCENE } from "./scene.ts";
import type { SceneTemplate, Scene, StateItem } from "./scene.ts";

const state = new Map();
const activeTemplate = reactive<SceneTemplate>(EMPTY_SCENE);
export const currentScene = computed<Scene>(() => {
  // TODO - typescript really dislikes the recursive types here, perhaps they can be simplified?
  // @ts-ignore
  return renderScene(activeTemplate, state);
});

export interface Engine {
  runExpr: (expr: string) => void;
  set: (k: string, v: StateItem) => void;
  loadScene: (name: string) => void;
}

/***
 * Update the properties on the active scene template with the values
 * from the new scene template.
 *
 * N.B - we have to update properties to maintain the Vue's reactivity.
 ***/
function swapScene(newScene: SceneTemplate) {
  activeTemplate.title = newScene.title;
  activeTemplate.description = newScene.description;
}

export const engine: Engine = {
  runExpr(expr: string) {
    console.log(expr);
  },
  set(k: string, v: StateItem) {
    state.set(k, v);
  },
  loadScene(name: string) {
    throw new Error("not yet implemented");
  },
};
