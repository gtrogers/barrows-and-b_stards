const BLANK_CHARACTER = {
  name: "Blank",
  hp: 3,
  stats: {
    brawn: {
      value: 0,
      skills: {
        athletics: { value: 0 },
        brutality: { value: 0 },
        discipline: { value: 0 },
      },
    },
    brains: {
      value: 0,
      skills: {
        know: { value: 0 },
        alch: { value: 0 },
        cunn: { value: 0 },
      },
    },
    coordination: {
      value: 0,
      skills: {
        move: { value: 0 },
        aim: { value: 0 },
        mani: { value: 0 },
      },
    },
    presence: {
      value: 0,
      skills: {
        will: { value: 0 },
        char: { value: 0 },
        appe: { value: 0 },
      },
    },
  },
};

type Character = typeof BLANK_CHARACTER;

const nameFirstPart = [
  "Ann",
  "Ath",
  "Bol",
  "Bea",
  "Cli",
  "Clo",
  "Doc",
  "Dor",
  "Eaw",
  "Elr",
  "Fea",
  "Fur",
];

const nameSecondPart = ["arn", "bar", "cragg", "durk", "ett", "fox", "gogg"];

function pick<T>(list: Array<T>): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function newCharacter(): Character {
  return {
    ...BLANK_CHARACTER,
    name: pick(nameFirstPart) + pick(nameSecondPart),
  };
}

export function countSkillPoints(char: Character): number {
  return Object.values(char.stats)
    .flatMap((s) => Object.values(s.skills))
    .reduce((a, n) => a + n.value, 0);
}

export function countStatPoints(char: Character): number {
  return Object.values(char.stats)
    .map((s) => s.value)
    .reduce((a, n) => a + n, 0);
}
