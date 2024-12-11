export const PLACE = {
  values: [4, 5, 6, 8, 9, 10],
  type: "place",
  labelFunc: val => `${val}`,
  verboseLabelFunc: (val, opt) => `${opt !== "default" ? ( opt === "buy" ? "Buy" : "Lay") + " the " : ""}Place ${val}`,
  codeFunc: val => `place--${val}`,
  options: ["buy", "lay"]
};

export const HARD_WAYS = {
  values: [4, 6, 8, 10],
  type: "hardWay",
  labelFunc: val => `${val}`,
  verboseLabelFunc: val => `Hard ${val}`,
  codeFunc: val => `hardWay-${val}`,
  options: []
};

export const HORN = {
  values: [2, 3, 11, 12],
  type: "horn",
  labelFunc: val => `${val}`,
  verboseLabelFunc: val => `Horn ${val}`,
  codeFunc: val => `horn-${val}`,
  options: []
};

export const ANY_CRAPS = {
  values: [2, 3, 12],
  type: "anyCraps",
  labelFunc: val => "Any Craps",
  verboseLabelFunc: val => "Any Craps",
  codeFunc: val => "anyCraps",
  options: []
};

export const C_AND_E = {
  values: [2, 3, 11, 12],
  type: "c-and-e",
  labelFunc: val => "C & E",
  verboseLabelFunc: val => "C & E",
  codeFunc: val => "c-and-e",
  options: []
};

export const FIELD = {
  values: [2, 3, 4, 9, 10, 11, 12],
  type: "field",
  labelFunc: val => "Field",
  verboseLabelFunc: val => "Field",
  codeFunc: val => "field",
  options: []
};

export const ANY_SEVEN = {
  values: [7],
  type: "anySeven",
  labelFunc: val => "Any Seven",
  verboseLabelFunc: val => "Any Seven",
  codeFunc: val => "anySeven",
  options: []
};

// The following declarations do not have a "values" array, because it's variable
// dependent on the state of the game

export const PASS = {
  type: "pass",
  labelFunc: val => "Pass Line",
  verboseLabelFunc: (val, opt) => `Pass Line${opt === "odds" ? " Odds" : ""}`,
  codeFunc: val => "pass",
  options: ["odds"]
};

export const DONT_PASS = {
  type: "pass",
  labelFunc: val => "Don't Pass Bar",
  verboseLabelFunc: (val, opt) => `Dont't Pass ${opt === "odds" ? "Odds" : "Bar"}`,
  codeFunc: val => "dontPass",
  options: ["odds"]
};

export const COME = {
  type: "come",
  labelFunc: val => "Come",
  verboseLabelFunc: (val, opt) => `Come${opt === "odds" ? " Odds" : ""}`,
  codeFunc: val => "come",
  options: ["odds"]
};

export const DONT_COME = {
  type: "come",
  labelFunc: val => "Don't Come",
  verboseLabelFunc: (val, opt) => `Don't Come${opt === "odds" ? " Odds" : ""}`,
  codeFunc: val => "dontCome",
  options: ["odds"]
};
