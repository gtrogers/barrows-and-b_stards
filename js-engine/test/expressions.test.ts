import { test, describe, expect, vi } from "vitest";

import type { Engine } from "../src/engine.ts";
import { parseAndRun, parse, run } from "../src/expressions.ts";
import type { TokenisedExpr } from "../src/expressions.ts";

describe("Expressions - module test", () => {
test.todo("Parsing and running an expression");
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

describe("", () => {
  const mockEngine: Engine = {
    runExpr: vi.fn(),
    set: vi.fn(),
    loadScene: vi.fn(),
    newGame: vi.fn(),
  };

  test("Running a simple expression", () => {
    const expr = ["Go", "to", "foobar"] as TokenisedExpr;
    run([expr], mockEngine);
    expect(mockEngine.loadScene).toHaveBeenCalledWith("foobar");
  });

  test.todo("Test running multiple expressions");
});

