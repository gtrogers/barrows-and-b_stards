const BLANK_CHARACTER = {
  name: "Blank",
  hp: 3,
  stats: {
    brawn: {
      value: 0,
      skills: {
          athletics: 0,
          brutality: 0,
          discipline: 0,
      }
    },
    brains: {
      value: 0,
      skills: {
        know: 0,
        alch: 0,
        cunn: 0,
      }
    },
    coordination: {
      value: 0,
      skills: {
        move: 0,
        aim: 0,
        mani: 0,
      }
    },
    presence: {
      value: 0,
      skills: {
        will: 0,
        char: 0,
        appe: 0,
      },
    }
  }
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
]

const nameSecondPart = [
  "arn",
  "bar",
  "cragg",
  "durk",
  "ett",
  "fox",
  "gogg"
]

function pick<T>(list: Array<T>): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function newCharacter(): Character {
  return {
    ...BLANK_CHARACTER,
    name: pick(nameFirstPart) + pick(nameSecondPart),
  } 
}
