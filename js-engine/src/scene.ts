type TextNodeChildren = LookupNode | string;
export type TextNode = ["text", TextNodeChildren[]];
export type LookupNode = ["lookup", string];
export type WhenNode = ["when", string, SceneNodes];
export type UnlessNode = ["unless", string, SceneNodes];
export type ActionNode = ["action", string, SceneNodes];
export type SetupNode = ["setup", string];
export type SceneNode =
  | TextNode
  | WhenNode
  | UnlessNode
  | ActionNode
  | SetupNode;
export type SceneNodes = SceneNode[];
export type Action = [string, string[]];

export interface SceneTemplate {
  title: SceneNodes;
  description: SceneNodes[];
}

interface Scene {
  description: string[];
  title: string;
  actions: Action[];
  setup: string[];
}

export type StateItem =
  | string
  | number
  | boolean
  | Array<StateItem>
  | Map<string, StateItem>;
export type StateStore = Map<string, StateItem>;

export function renderNodes(
  ns: SceneNodes,
  state: StateStore
): [string[], Action[], string[]] {
  let result: string[] = [];
  let actions: Action[] = [];
  let setup: string[] = [];
  for (let n of ns) {
    const nodeType = n[0];
    switch (nodeType) {
      case "text":
        const content: string[] = [];
        const children = n[1];
        children.forEach((child) => {
          if (typeof child === "string") {
            content.push(child);
          } else {
            const varToGet = child[1];
            const value = state.get(varToGet);
            value && content.push(value.toString());
          }
        });
        result.push(content.join(""));

        break;
      case "when": {
        const [varName, node] = n.slice(1);
        if (state.get(varName as string)) {
          // TODO - why can't TSC figure this one out?
          const [whenContent, whenActions] = renderNodes(
            node as SceneNodes,
            state
          );
          result = result.concat(whenContent);
          actions = actions.concat(whenActions);
        }
        break;
      }
      case "unless": {
        const [varName, nodes] = n.slice(1);
        if (!state.get(varName as string)) {
          const [unlessContent, unlessActions] = renderNodes(
            nodes as SceneNodes,
            state
          );
          result = result.concat(unlessContent);
          actions = actions.concat(unlessActions);
        }
        break;
      }
      case "action":
        const [payload, nodes] = n.slice(1);
        // TODO - actions cannot contain an action, we should error out here if they do
        actions.push([
          payload as string,
          renderNodes(nodes as SceneNodes, state)[0],
        ]);
        break;
      case "setup":
        const expression = n[1];
        setup.push(expression);
        break;
      default:
        throw new Error("Unsupported node: " + n[0]);
    }
  }
  return [result, actions, setup];
}

export function renderScene(st: SceneTemplate, state: StateStore): Scene {
  const renderedScene = st.description.map((ns) => renderNodes(ns, state));
  return {
    title: renderNodes(st.title, state)[0][0],
    description: renderedScene.map((rs) => rs[0])[0],
    actions: renderedScene.flatMap((rs) => rs[1]),
    setup: renderedScene.flatMap((rs) => rs[2]),
  };
}

export type { Scene };
