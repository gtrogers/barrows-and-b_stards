import { renderNodes, renderScene } from "../src/scene.ts";
import type {
  TextNode,
  WhenNode,
  ActionNode,
  SceneNodes,
  SceneTemplate,
} from "../src/scene.ts";

describe("scene rendering - module test", () => {
  test("Render a scene and actions", () => {
    const state = new Map();
    state.set("fire", true);
    state.set("playerName", "Bob");
    const description: SceneNodes[] = [
      [
        ["text", ["Ominous intro text"]],
        ["text", ["It was a dark and stormy night..."]],
        ["when", "fire", [["text", ["The fire burned on the hearth."]]]],
        ["text", [["lookup", "playerName"], " was sitting alone."]],
        ["action", "Go outside.", [["text", ["Explore outside"]]]],
        ["action", "Reload.", [["text", ["Stay put"]]]],
      ],
    ];
    const template: SceneTemplate = {
      title: [["text", ["some title"]]],
      description,
    };
    const result = renderScene(template, state);
    expect(result.description).toEqual([
      "Ominous intro text",
      "It was a dark and stormy night...",
      "The fire burned on the hearth.",
      "Bob was sitting alone.",
    ]);
    expect(result.title).toEqual("some title");
    expect(result.actions).toEqual([
      ["Go outside.", ["Explore outside"]],
      ["Reload.", ["Stay put"]],
    ]);
  });
});

const dummyState = new Map();

describe("scene rendering - unit tests", () => {
  beforeAll(() => {
    dummyState.set("someNumber", 123);
  });

  test("Rendering a text node to a string", () => {
    const textNode: TextNode = ["text", ["Hello World"]];
    const [content, _] = renderNodes([textNode], dummyState);
    expect(content).toEqual(["Hello World"]);
  });

  test("Rendering a lookup node to a string grabs the variable and converts it to a string", () => {
    // TODO - test toString on all variables
    const lookupNode: TextNode = ["text", [["lookup", "someNumber"]]];
    const [content, _] = renderNodes([lookupNode], dummyState);
    expect(content).toEqual(["123"]);
  });

  test("Rendering a when node only displays a string when the variable is truthy", () => {
    // TODO - ideally we want to evaluate a small expression instead
    const whenNode: WhenNode = [
      "when",
      "someNumber",
      [["text", ["it works!"]]],
    ];
    const [content, _] = renderNodes([whenNode], dummyState);
    expect(content).toEqual(["it works!"]);

    const whenNode2: WhenNode = ["when", "blank", [["text", ["whatever"]]]];
    const [noContent, __] = renderNodes([whenNode2], dummyState);
    expect(noContent).toHaveLength(0);
  });

  test("Renders actions into seperate list", () => {
    const actionNode: ActionNode = [
      "action",
      "some payload",
      [["text", ["click me"]]],
    ];
    const [content, actions] = renderNodes([actionNode], dummyState);
    expect(content).toEqual([]);
    expect(actions).toEqual([["some payload", ["click me"]]]);
  });
});
