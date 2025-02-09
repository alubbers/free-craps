const _DEFAULT_OPTION_SUFFIX = "-default";

export const POINTS = [4, 5, 6, 8, 9, 10]

export const PLACE = {
  values: POINTS,
  type: "place",
  labelFunc: val => `${val}`,
  verboseLabelFunc: (val, opt) => `${opt !== "default" ? ( opt === "buy" ? "Buy" : "Lay") + " the " : ""}Place ${val}`,
  codeFunc: (val, opt) => `place-${val}${opt ? "-" + opt : _DEFAULT_OPTION_SUFFIX}`,
  options: ["buy", "lay"]
};

export const HARD_WAYS = {
  values: [4, 6, 8, 10],
  type: "hardWay",
  labelFunc: val => `${val}`,
  verboseLabelFunc: val => `Hard ${val}`,
  codeFunc: (val, opt) => `hardWay-${val}-default`,
  options: []
};

export const HORN = {
  values: [2, 3, 11, 12],
  type: "horn",
  labelFunc: val => `${val}`,
  verboseLabelFunc: val => `Horn ${val}`,
  codeFunc: (val, opt) => `horn-${val}-default`,
  options: []
};

export const ANY_CRAPS = {
  values: [2, 3, 12],
  type: "anyCraps",
  labelFunc: () => "Any Craps",
  verboseLabelFunc: () => "Any Craps",
  codeFunc: () => "anyCraps-default",
  options: []
};

export const C_AND_E = {
  values: [2, 3, 11, 12],
  type: "c-and-e",
  labelFunc: () => "C & E",
  verboseLabelFunc: () => "C & E",
  codeFunc: () => "c-and-e-default",
  options: []
};

export const FIELD = {
  values: [2, 3, 4, 9, 10, 11, 12],
  type: "field",
  labelFunc: () => "Field",
  verboseLabelFunc: () => "Field",
  codeFunc: () => "field-default",
  options: []
};

export const ANY_SEVEN = {
  values: [7],
  type: "anySeven",
  labelFunc: () => "Any Seven",
  verboseLabelFunc: () => "Any Seven",
  codeFunc: () => "anySeven-default",
  options: []
};

// The following declarations do not have a "values" array, because it's variable
// dependent on the state of the game

export const PASS = {
  type: "pass",
  labelFunc: val => "Pass Line",
  verboseLabelFunc: (val, opt) => `Pass Line${opt === "odds" ? " Odds" : ""}`,
  codeFunc: (val, opt) => `pass${opt ? "-" + opt : _DEFAULT_OPTION_SUFFIX}`,
  options: ["odds"]
};

export const DONT_PASS = {
  type: "dontPass",
  labelFunc: val => "Don't Pass Bar",
  verboseLabelFunc: (val, opt) => `Dont't Pass ${opt === "odds" ? "Odds" : "Bar"}`,
  codeFunc: (val, opt) => `dontPass${opt ? "-" + opt : _DEFAULT_OPTION_SUFFIX}`,
  options: ["odds"]
};

export const COME = {
  type: "come",
  labelFunc: val => "Come",
  verboseLabelFunc: (val, opt) => `Come${opt === "odds" ? " Odds" : ""}`,
  codeFunc: (val, opt) => `come${val ? "-" + val : ""}${opt ? "-" + opt : _DEFAULT_OPTION_SUFFIX}`,
  options: ["odds"]
};

export const DONT_COME = {
  type: "dontCome",
  labelFunc: val => "Don't Come",
  verboseLabelFunc: (val, opt) => `Don't Come${opt === "odds" ? " Odds" : ""}`,
  codeFunc: (val, opt) => `dontCome${val ? "-" + val : ""}${opt ? "-" + opt : _DEFAULT_OPTION_SUFFIX}`,
  options: ["odds"]
};
