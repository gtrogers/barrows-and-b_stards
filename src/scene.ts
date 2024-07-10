export type TextNode = ["text", string];
export type LookupNode = ["lookup", string];
export type WhenNode = ["when", string, SceneNodes];
export type ActionNode = ["action", string, SceneNodes];
export type SceneNode = TextNode | LookupNode | WhenNode | ActionNode;
export type SceneNodes = SceneNode[];
export type Action = [string, string]

export interface SceneTemplate {
  title: SceneNodes
  description: SceneNodes[]
}

export const EMPTY_SCENE: SceneTemplate = {
  title: [["text", "no scene"]],
  // TODO - this isn't actually the description, more like the body text
  description: [[["text", "no scene"],["action", "nothing", [["text", "No action"]]]]]
}

interface Scene {
  description: string[];
  title: string;
  actions: Action[];
}

export type StateItem = string | number | boolean | Array<StateItem> | Map<string, StateItem>;
export type StateStore = Map<string, StateItem>;

export function renderNodes (ns: SceneNodes, state: StateStore): [string, Action[]] {
  const result: string[] = [];
  const actions: Action[] = [];
  for (let n of ns) {
    const [nodeType, ...rest] = n;
    switch (nodeType) {
      case "text":
        result.push(rest[0]);
        break;
      case "lookup":
        result.push(state.get(rest[0])?.toString() || "undefined");
        break;
      case "when":
        const [varName, node] = rest;
        if (state.get(varName)) {
          // TODO - why can't TSC figure this one out?
          const children = renderNodes(node as SceneNodes, state);
          result.push(children[0]);
          actions.concat(children[1]);
        }
        break;
      case "action":
        const [payload, nodes] = rest;
        // TODO - actions cannot contain an action, we should error out here if they do
        actions.push([payload, renderNodes(nodes as SceneNodes, state)[0]]);
        break;
      default:
        result.push("Not supported yet!");
    }
  }
  return [result.join(" "), actions];
}

export function renderScene(st: SceneTemplate, state: StateStore): Scene {
  const renderedScene = st.description.map(ns => renderNodes(ns, state));
  return {
    title: renderNodes(st.title, state)[0],
    description: renderedScene.map(rs => rs[0]),
    actions: renderedScene.flatMap(rs => rs[1]),
  }
}

export type {
  Scene
}
