import type { Engine } from "./engine";

type ExpressionError = { error: string };
type ExpressionFunc = (args: string[], eng: Engine) => void | ExpressionError;
type FuncName = "Go" | "Set" | "Roll";
export type TokenisedExpr = [FuncName, ...string[]];

const KEYWORDS_TO_FUNCS: Record<FuncName, ExpressionFunc> = {
  Go: (args: string[], eng: Engine) => {
    const sceneName = args.at(-1);
    if (!sceneName) {
      return { error: "Missing scene name" };
    } else {
      eng.loadScene(sceneName);
    }
  },
  Set: (args: string[], eng: Engine) => {
    const [k, _, v] = args;
    if (!k || !v) return { error: "A key and value are required for Set" };
    eng.set(k, v);
  },
  Roll: (args: string[], eng: Engine) => {
    const [stat, _] = args;
  },
};

function isFuncName(s: string): s is FuncName {
  return Object.keys(KEYWORDS_TO_FUNCS).indexOf(s) >= 0;
}

export function parse(snippet: string): TokenisedExpr[] {
  const exprs = snippet
    .split(".")
    .filter((expr) => expr.length > 0)
    .map((expr) => expr.trim());

  const tokens = exprs.map((expr) => {
    const splitExpr = expr.split(" ");
    if (isFuncName(splitExpr[0])) {
      return splitExpr;
    } else {
      throw new Error("Unknown func name " + splitExpr[0]);
    }
  });

  // TODO - should be able to get TSC to infer this type with the right kind of type guard
  //        may need to pull out the expr level tokenising into it's own function to do it
  return tokens as TokenisedExpr[];
}

export function run(tokens: TokenisedExpr[], eng: Engine) {
  tokens.forEach(expr => {
    const [funcName, ...args] = expr;
    KEYWORDS_TO_FUNCS[funcName](args, eng);
  })
}

export function parseAndRun(expr: string, eng: Engine) {
  run(parse(expr), eng);
}
