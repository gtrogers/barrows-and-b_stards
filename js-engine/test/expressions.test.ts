import { test, describe, expect, vi } from "vitest";

import type { Engine } from "../src/engine.ts";
import { parseAndRun, parse, run, KEYWORDS_TO_FUNCS } from "../src/expressions.ts";
import type { TokenisedExpr } from "../src/expressions.ts";

function mockEngine(): Engine {
  return {
    runExpr: vi.fn(),
    set: vi.fn(),
    loadScene: vi.fn(),
    newGame: vi.fn(),
    gotoScreen: vi.fn(),
  }
}

describe("Expressions - module test", () => {
  test("Parsing and running an expression", () => {
    const engine = mockEngine();
    const expression = "Set foo to bar. Go to blah."

    parseAndRun(expression, engine); 

    expect(engine.set).toHaveBeenCalledWith("foo", "bar");
    expect(engine.loadScene).toHaveBeenCalledWith("blah");
  });
});

describe("Expressions - test parsing", () => {
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

describe("Expressions - running", () => {

  test("Running a simple expression", () => {
    const expr = ["Go", "to", "foobar"] as TokenisedExpr;
    const engine = mockEngine();

    run([expr], engine);

    expect(engine.loadScene).toHaveBeenCalledWith("foobar");
  });

  test("Test running multiple expressions", () => {
    const expr1 = ["Set", "foo", "to", "bar"] as TokenisedExpr;
    const expr2 = ["Set", "zap", "to", "foo"] as TokenisedExpr;

    const engine = mockEngine();

    run([expr1, expr2], engine);
  });
});

describe("Expressions - function", () => {
  test("Set", () => {
    const engine = mockEngine();

    KEYWORDS_TO_FUNCS["Set"](["foo", "to", "bar"], engine);

    expect(engine.set).toHaveBeenCalledWith("foo", "bar");
  })

  test("Go", () => {
    const engine = mockEngine();

    KEYWORDS_TO_FUNCS['Go'](["to", "zap"], engine);

    expect(engine.loadScene).toHaveBeenCalledWith("zap");
  });

  test("Go - 'to' is optional", () => {
    const engine = mockEngine();

    KEYWORDS_TO_FUNCS["Go"](["wibble"], engine);

    expect(engine.loadScene).toHaveBeenCalledWith("wibble");
  });
});
