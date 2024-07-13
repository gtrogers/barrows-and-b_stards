import type { Engine } from "../src/engine";
import { parseAndRun, parse, run } from "../src/expressions";
import type { TokenisedExpr } from "../src/expressions";

describe("Expressions - module test", () => {
  test.todo("Parsing and running an expression");
});

describe("Expression parsing - unit tests", () => {
  test("Parse a single expression to tokens", () => {
    const expr = "Go to foobar.";
    const result = parse(expr);
    expect(result).toEqual([["Go", "to", "foobar"]]);
  });

  test("Parse multiple expressions to tokens", () => {
    const expr = `Set blah to zap. Go to Foobar`;
    const result = parse(expr);
    expect(result).toEqual([
      ["Set", "blah", "to", "zap"],
      ["Go", "to", "Foobar"],
    ]);
  });
});

describe("Token running - unit tests", () => {
  const mockEngine: Engine = {
    runExpr: jest.fn(),
    set: jest.fn(),
    loadScene: jest.fn(),
    newGame: jest.fn(),
  };

  test("Running a simple expression", () => {
    const expr = ["Go", "to", "foobar"] as TokenisedExpr;
    run([expr], mockEngine);
    expect(mockEngine.loadScene).toHaveBeenCalledWith("foobar");
  });

  test.todo("Test running multiple expressions");
});

describe("Functions - unit tests", () => {});
