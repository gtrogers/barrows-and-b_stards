import { test, describe, beforeAll, expect, vi } from "vitest";

import { renderNodes, renderScene } from "../src/scene.ts";
import type { Engine } from "../src/engine.ts";
import type {
  TextNode,
  WhenNode,
  ActionNode,
  SceneNodes,
  SceneTemplate,
  UnlessNode,
  SetupNode,
} from "../src/scene.ts";


describe("End to end", () => {
  test("Render a scene and actions", () => {
    const state = new Map();
    state.set("fire", true);
    state.set("playerName", "Bob");
    const description: SceneNodes[] = [
      [
        ["setup", "Set fire to false."],
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
    expect(result.setup).toEqual(["Set fire to false."]);
  });
});

const dummyState = new Map();

describe("Scene - unit tests", () => {
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

  test("Rendering an unless node only displays when the value is falsey", () => {
    const unlessNode: UnlessNode = [
      "unless",
      "someVal",
      [["text", ["hello"]]]
    ];

    const [content, _] = renderNodes([unlessNode], dummyState);
    expect(content).toEqual(["hello"]);
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

  test("Renders setup into a seperate list", () => {
    const setupNode: SetupNode = [
      "setup",
      "Do a thing."
    ];

    const [_, __, setup] = renderNodes([setupNode], dummyState);

    expect(setup).toEqual(["Do a thing."]);
  });
});
