import { renderNodes, renderScene } from "../src/scene.ts";
import type {
  LookupNode,
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
      [["text", "Ominous intro text"]],
      [
        ["text", "It was a dark and stormy night..."],
        ["when", "fire", [["text", "The fire burned on the hearth."]]],
        ["lookup", "playerName"],
        ["text", "was sitting alone."],
        ["action", "Go outside.", [["text", "Explore outside"]]],
        ["action", "Reload.", [["text", "Stay put"]]],
      ],
    ];
    const template: SceneTemplate = {
      title: [["text", "some title"]],
      description,
    }
    const result = renderScene(template, state);
    expect(result.description).toEqual(["Ominous intro text",
      "It was a dark and stormy night... The fire burned on the hearth. Bob was sitting alone."]
    );
    expect(result.title).toEqual("some title");
    expect(result.actions).toEqual([
      ["Go outside.", "Explore outside"],
      ["Reload.", "Stay put"],
    ]);
  });
});

const dummyState = new Map();

describe("scene rendering - unit tests", () => {
  beforeAll(() => {
    dummyState.set("someNumber", 123);
  });

  test("Rendering a text node to a string", () => {
    const textNode: TextNode = ["text", "Hello World"];
    const result = renderNodes([textNode], dummyState);
    expect(result[0]).toEqual("Hello World");
  });

  test("Rendering a lookup node to a string grabs the variable and converts it to a string", () => {
    // TODO - test toString on all variables
    const lookupNode: LookupNode = ["lookup", "someNumber"];
    const result = renderNodes([lookupNode], dummyState);
    expect(result[0]).toEqual("123");
  });

  test("Rendering a when node only displays a string when the variable is true", () => {
    // TODO - ideally we want to evaluate a small expression instead
    const whenNode: WhenNode = ["when", "someNumber", [["text", "it works!"]]];
    const positiveResult = renderNodes([whenNode], dummyState);
    expect(positiveResult[0]).toEqual("it works!");

    const whenNode2: WhenNode = ["when", "blank", [["text", "whatever"]]];
    const negativeResult = renderNodes([whenNode2], dummyState);
    expect(negativeResult[0]).toEqual("");
  });

  test("Renders actions into seperate list", () => {
    const actionNode: ActionNode = [
      "action",
      "some payload",
      [["text", "click me"]],
    ];
    const result = renderNodes([actionNode], dummyState);
    expect(result[0]).toEqual("");
    expect(result[1]).toEqual([["some payload", "click me"]]);
  });
});
