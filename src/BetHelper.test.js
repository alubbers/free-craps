import { RollUtils } from "./RollUtils";
import BetHelper from "./BetHelper";

const rollUtils = new RollUtils();

const betHelper = new BetHelper();

// default to a roll of a 7 with no bets and no point set
const buildTestResults = (
    roll = { a: 3, b: 4, total: 7 },
    activeBets = [],
    existingPoint = 0 ) => {

      return betHelper.buildBetResults({
        roll: roll,
        crapsMeta: rollUtils.buildCrapsResult(roll, existingPoint),
        activeBets: activeBets
      });
   };

test("buildBetResults.win-pass-line-no-point", () => {

  [
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "pass", type: "default"} ]),
    buildTestResults({a:5, b:2, total:7}, [ { amount: 5n, bucketCode: "pass", type: "default"} ]),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, bucketCode: "pass", type: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual("pass");
  });
});

test("buildBetResults.win-pass-line-point-hit", () => {
  [
    buildTestResults({a:2, b:4, total:6}, [ { amount: 5n, bucketCode: "pass", type: "default"} ], 6),
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, bucketCode: "pass", type: "default"} ], 4),
    buildTestResults({a:5, b:5, total:10}, [ { amount: 5n, bucketCode: "pass", type: "default"} ], 10),
    buildTestResults({a:3, b:6, total:9}, [ { amount: 5n, bucketCode: "pass", type: "default"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual("pass");
  });
});

test("buildBetResults.lose-pass-line-no-point", () => {

  [
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "pass", type: "default"} ]),
    buildTestResults({a:1, b:1, total:2}, [ { amount: 5n, bucketCode: "pass", type: "default"} ]),
    buildTestResults({a:6, b:6, total:12}, [ { amount: 5n, bucketCode: "pass", type: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("pass");
  });
});

test("buildBetResults.lose-pass-line-line-away", () => {

  [
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "pass", type: "default"} ], 5),
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "pass", type: "default"} ], 8),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("pass");
  });
});


test("buildBetResults.win-dont-pass-bar-no-point-set", () => {
  const testRolls = [
    {a: 2, b: 1, total: 3},
    {a: 1, b: 1, total: 2},
    {a: 1, b: 2, total: 3}
  ];

  testRolls.forEach(roll => {
    const result = buildTestResults( roll,
       [ { amount: 5n, bucketCode: "dontPass", type: "default"} ]);

    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual("dontPass");
  });
});

test("buildBetResults.push-12-dont-pass-bar", () => {
  // on a 12, expect no winners or losers
  const result = buildTestResults( {a: 6, b: 6, total: 12},
     [ { amount: 5n, bucketCode: "dontPass", type: "default"} ]);

  expect(result.winners.length).toEqual(0);
  expect(result.losers.length).toEqual(0);

});

test("buildBetResults.win-dont-pass-bar-point-set", () => {
  const result = buildTestResults( undefined,
     [ { amount: 5n, bucketCode: "dontPass", type: "default"} ], 10);

  expect(result.winners.length).toEqual(1);
  expect(result.losers.length).toEqual(0);
  expect(result.winners[0].bucketCode).toEqual("dontPass");
});

test("buildBetResults.lose-dont-pass-bar-no-point-set", () => {
  [
    {a: 2, b: 5, total: 7},
    {a: 5, b: 6, total: 11},
    {a: 1, b: 6, total: 7}
  ].forEach(roll => {
    const result = buildTestResults( roll,
       [ { amount: 5n, bucketCode: "dontPass", type: "default"} ]);

    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("dontPass");
  });
});

test("buildBetResults.lose-dont-pass-bar-point-set", () => {
  [
    {a: 2, b: 2, total: 4},
    {a: 5, b: 3, total: 8},
    {a: 3, b: 6, total: 9}
  ].forEach(roll => {
    const result = buildTestResults( roll,
       [ { amount: 5n, bucketCode: "dontPass", type: "default"} ], roll.total);

    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("dontPass");
  });
});

