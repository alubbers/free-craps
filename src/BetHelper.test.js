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

const fieldBet = { amount: 5n, bucketCode: "field", type: "default"};

const anyCrapsBet = { amount: 5n, bucketCode: "anyCraps", type: "default"};

const c_and_e_Bet = { amount: 5n, bucketCode: "c-and-e", type: "default"};

const anySevenBet = { amount: 5n, bucketCode: "anySeven", type: "default"};

const comeBet = { amount: 5n, bucketCode: "come", type: "default" };

const dontComeBet = { amount: 5n, bucketCode: "dontCome", type: "default" };

const hornBetFunc = (val) => { return { amount: 5n, bucketCode: `horn-${val}`, type: "default" } };


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

test("buildBetResults.win-pass-line-with-odds-point-hit", () => {
  [
    buildTestResults({a:2, b:4, total:6}, [ { amount: 5n, bucketCode: "pass", type: "default"}, { amount: 10n, bucketCode: "pass", type: "odds"} ], 6),
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, bucketCode: "pass", type: "default"}, { amount: 10n, bucketCode: "pass", type: "odds"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    let foundOddsBet = result.winners.find(x => x.bucketCode === "pass" && x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount).toEqual(10n);
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

test("buildBetResults.lose-pass-line-with-odds-line-away", () => {
  [
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "pass", type: "default"}, { amount: 10n, bucketCode: "pass", type: "odds"} ], 6),
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "pass", type: "default"}, { amount: 10n, bucketCode: "pass", type: "odds"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);
    let foundOddsBet = result.losers.find(x => x.bucketCode === "pass" && x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount).toEqual(10n);
  });
});

test("buildBetResults.no-change-pass-line", () => {
  const testRollsAndPoints = [
    [ {a: 6, b: 5, total: 11}, 6],
    [ {a: 8, b: 1, total: 9}, undefined],
    [ {a: 3, b: 2, total: 5}, 10],
  ];

  const bets = [
    [ { amount: 5n, bucketCode: "pass", type: "default"} ],
    [ { amount: 5n, bucketCode: "pass", type: "default"}, { amount: 10n, bucketCode: "pass", type: "odds"} ]
  ];

  testRollsAndPoints.forEach(roll => {
    bets.forEach(bet => {
      const result = buildTestResults( roll[0], bet, roll[1] );

      expect(result.winners.length).toEqual(0);
      expect(result.losers.length).toEqual(0);
    });
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

test("buildBetResults.no-change-dont-pass-bar", () => {
  const testRollsAndPoints = [
    [ {a: 6, b: 5, total: 11}, 6],
    [ {a: 8, b: 1, total: 9}, undefined],
    [ {a: 3, b: 2, total: 5}, 10],
  ];

  const bets = [
    [ { amount: 5n, bucketCode: "dontPass", type: "default"} ],
    [ { amount: 5n, bucketCode: "dontPass", type: "default"}, { amount: 10n, bucketCode: "dontPass", type: "odds"} ]
  ];

  testRollsAndPoints.forEach(roll => {
    bets.forEach(bet => {
      const result = buildTestResults( roll[0], bet, roll[1] );

      expect(result.winners.length).toEqual(0);
      expect(result.losers.length).toEqual(0);
    });
  });
});

test("buildBetResults.win-dont-pass-bar-point-set", () => {
  const result = buildTestResults( undefined,
     [ { amount: 5n, bucketCode: "dontPass", type: "default"} ], 10);

  expect(result.winners.length).toEqual(1);
  expect(result.losers.length).toEqual(0);
  expect(result.winners[0].bucketCode).toEqual("dontPass");
});

test("buildBetResults.win-dont-pass-bar-with-odds-point-set", () => {
  [
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "dontPass", type: "default"}, { amount: 10n, bucketCode: "dontPass", type: "odds"} ], 6),
    buildTestResults(undefined, [ { amount: 5n, bucketCode: "dontPass", type: "default"}, { amount: 10n, bucketCode: "dontPass", type: "odds"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    let foundOddsBet = result.winners.find(x => x.bucketCode === "dontPass" && x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
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

test("buildBetResults.lose-dont-pass-bar-with-odds-point-set", () => {
  [
    {a: 2, b: 2, total: 4},
    {a: 5, b: 3, total: 8},
    {a: 3, b: 6, total: 9}
  ].forEach(roll => {
    const result = buildTestResults( roll,
       [ { amount: 5n, bucketCode: "dontPass", type: "default"},
       { amount: 10n, bucketCode: "dontPass", type: "odds"} ], roll.total);

    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);
    let foundOddsBet = result.losers.find(x => x.bucketCode === "dontPass" && x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});


test("buildBetResults.win-hard-ways", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "hardWay-4", type: "default"} ], 6),
    buildTestResults({a:3, b:3, total:6}, [ { amount: 5n, bucketCode: "hardWay-6", type: "default"} ]),
    buildTestResults({a:4, b:4, total:8}, [ { amount: 5n, bucketCode: "hardWay-8", type: "default"} ], 8),
    buildTestResults({a:5, b:5, total:10}, [ { amount: 5n, bucketCode: "hardWay-10", type: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringContaining("hardWay-"));
  });
});

test("buildBetResults.push-hard-ways", () => {
  [
    buildTestResults({a:3, b:3, total:6}, [ { amount: 5n, bucketCode: "hardWay-4", type: "default"} ], 6),
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, bucketCode: "hardWay-6", type: "default"} ]),
    buildTestResults({a:2, b:3, total:5}, [ { amount: 5n, bucketCode: "hardWay-8", type: "default"} ], 8),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "hardWay-10", type: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-hard-ways", () => {
  [
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, bucketCode: "hardWay-4", type: "default"} ], 6),
    // lose on a 7, but only if a point is set
    buildTestResults({a:3, b:4, total:7}, [ { amount: 5n, bucketCode: "hardWay-6", type: "default"} ], 5),
    buildTestResults({a:5, b:3, total:8}, [ { amount: 5n, bucketCode: "hardWay-8", type: "default"} ], 8),
    buildTestResults({a:4, b:6, total:10}, [ { amount: 5n, bucketCode: "hardWay-10", type: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringContaining("hardWay-"));
  });
});

test("buildBetResults.win-field", () => {
  [
    buildTestResults({a:1, b:1, total:2}, [ fieldBet ]),
    buildTestResults({a:1, b:2, total:3}, [ fieldBet ]),
    buildTestResults({a:2, b:2, total:4}, [ fieldBet ], 6),
    buildTestResults({a:5, b:4, total:9}, [ fieldBet ], 8),
    buildTestResults({a:6, b:4, total:10}, [ fieldBet ], 5),
    buildTestResults({a:5, b:6, total:11}, [ fieldBet ]),
    buildTestResults({a:6, b:6, total:12}, [ fieldBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual("field");
  });
});

test("buildBetResults.lose-field", () => {
  [
    buildTestResults({a:1, b:4, total:5}, [ fieldBet ]),
    buildTestResults({a:4, b:2, total:6}, [ fieldBet ]),
    buildTestResults({a:4, b:4, total:8}, [ fieldBet ], 8),
    buildTestResults({a:3, b:4, total:7}, [ fieldBet ], 8),
    buildTestResults({a:1, b:6, total:7}, [ fieldBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("field");
  });
});

test("buildBetResults.win-anyCraps", () => {
  [
    buildTestResults({a:1, b:1, total:2}, [ anyCrapsBet ]),
    buildTestResults({a:1, b:2, total:3}, [ anyCrapsBet ], 4),
    buildTestResults({a:6, b:6, total:12}, [ anyCrapsBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual("anyCraps");
  });
});

test("buildBetResults.lose-anyCraps", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ anyCrapsBet ], 6),
    buildTestResults({a:5, b:4, total:9}, [ anyCrapsBet ], 8),
    buildTestResults({a:6, b:4, total:10}, [ anyCrapsBet ], 5),
    buildTestResults({a:5, b:6, total:11}, [ anyCrapsBet ]),
    buildTestResults({a:1, b:4, total:5}, [ anyCrapsBet ]),
    buildTestResults({a:4, b:2, total:6}, [ anyCrapsBet ]),
    buildTestResults({a:4, b:4, total:8}, [ anyCrapsBet ], 8),
    buildTestResults({a:3, b:4, total:7}, [ anyCrapsBet ], 8),
    buildTestResults({a:1, b:6, total:7}, [ anyCrapsBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("anyCraps");
  });
});

test("buildBetResults.win-c-and-e", () => {
  [
    buildTestResults({a:1, b:1, total:2}, [ c_and_e_Bet ]),
    buildTestResults({a:1, b:2, total:3}, [ c_and_e_Bet ], 4),
    buildTestResults({a:5, b:6, total:11}, [ c_and_e_Bet ], 10),
    buildTestResults({a:6, b:5, total:11}, [ c_and_e_Bet ]),
    buildTestResults({a:6, b:6, total:12}, [ c_and_e_Bet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual("c-and-e");
  });
});

test("buildBetResults.lose-c-and-e", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ c_and_e_Bet ], 6),
    buildTestResults({a:5, b:4, total:9}, [ c_and_e_Bet ], 8),
    buildTestResults({a:6, b:4, total:10}, [ c_and_e_Bet ], 5),
    buildTestResults({a:1, b:4, total:5}, [ c_and_e_Bet ]),
    buildTestResults({a:4, b:2, total:6}, [ c_and_e_Bet ]),
    buildTestResults({a:4, b:4, total:8}, [ c_and_e_Bet ], 8),
    buildTestResults({a:3, b:4, total:7}, [ c_and_e_Bet ], 8),
    buildTestResults({a:1, b:6, total:7}, [ c_and_e_Bet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual("c-and-e");
  });
});

test("buildBetResults.win-anySeven", () => {
  [
    buildTestResults({a:3, b:4, total:7}, [ anySevenBet ], 8),
    buildTestResults({a:1, b:6, total:7}, [ anySevenBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(anySevenBet.bucketCode);
  });
});

test("buildBetResults.lose-anySeven", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ anySevenBet ], 6),
    buildTestResults({a:5, b:4, total:9}, [ anySevenBet ], 8),
    buildTestResults({a:6, b:4, total:10}, [ anySevenBet ], 5),
    buildTestResults({a:1, b:4, total:5}, [ anySevenBet ]),
    buildTestResults({a:4, b:2, total:6}, [ anySevenBet ]),
    buildTestResults({a:4, b:4, total:8}, [ anySevenBet ], 8),
    buildTestResults({a:1, b:1, total:2}, [ anySevenBet ]),
    buildTestResults({a:1, b:2, total:3}, [ anySevenBet ], 4),
    buildTestResults({a:5, b:6, total:11}, [ anySevenBet ], 10),
    buildTestResults({a:6, b:5, total:11}, [ anySevenBet ]),
    buildTestResults({a:6, b:6, total:12}, [ anySevenBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(anySevenBet.bucketCode);
  });
});

test("buildBetResults.win-come-default", () => {
  [
    buildTestResults({a:3, b:4, total:7}, [ comeBet ]),
    buildTestResults({a:1, b:6, total:7}, [ comeBet ]),
    buildTestResults({a:5, b:6, total:11}, [ comeBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(comeBet.bucketCode);
  });
});

test("buildBetResults.push-come-default", () => {
  [
    buildTestResults({a:4, b:2, total:6}, [ comeBet ]),
    buildTestResults({a:1, b:3, total:4}, [ comeBet ]),
    buildTestResults({a:1, b:1, total:2}, [ comeBet ], 5),
    buildTestResults({a:6, b:6, total:12}, [ comeBet ], 10),
    buildTestResults({a:2, b:6, total:8}, [ comeBet ], 10)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-come-default", () => {
  [
    buildTestResults({a:1, b:2, total:3}, [ comeBet ]),
    buildTestResults({a:1, b:1, total:2}, [ comeBet ]),
    buildTestResults({a:6, b:6, total:12}, [ comeBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(comeBet.bucketCode);
  });
});

test("buildBetResults.win-dont-come-default", () => {
  [
    buildTestResults({a:1, b:2, total:3}, [ dontComeBet ]),
    buildTestResults({a:1, b:1, total:2}, [ dontComeBet ]),
    buildTestResults({a:2, b:1, total:3}, [ dontComeBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(dontComeBet.bucketCode);
  });
});

test("buildBetResults.push-12-point-off-dont-come-default", () => {
  [
    buildTestResults({a:6, b:6, total:12}, [ dontComeBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.push-dont-come-default", () => {
  [
    buildTestResults({a:4, b:2, total:6}, [ dontComeBet ]),
    buildTestResults({a:1, b:3, total:4}, [ dontComeBet ]),
    buildTestResults({a:1, b:1, total:2}, [ dontComeBet ], 5),
    buildTestResults({a:6, b:6, total:12}, [ dontComeBet ], 10),
    buildTestResults({a:2, b:6, total:8}, [ dontComeBet ], 10)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-dont-come-default", () => {
  [
    buildTestResults({a:3, b:4, total:7}, [ dontComeBet ]),
    buildTestResults({a:1, b:6, total:7}, [ dontComeBet ]),
    buildTestResults({a:5, b:6, total:11}, [ dontComeBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(dontComeBet.bucketCode);
  });
});

// Test come bets that have been set on their own point
test("buildBetResults.win-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "come-4", type: "default"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "come-4", type: "default"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "come-9", type: "default"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringMatching('come'));
  });
});

test("buildBetResults.win-come-points-with-odds", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "come-4", type: "default"}, { amount: 10n, bucketCode: "come-4", type: "odds"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "come-4", type: "default"}, { amount: 10n, bucketCode: "come-4", type: "odds"}  ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "come-9", type: "default"}, { amount: 10n, bucketCode: "come-9", type: "odds"}  ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);

    const foundOddsBet = result.winners.find(x => x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});

test("buildBetResults.push-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "come-5", type: "default"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, bucketCode: "come-4", type: "default"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "come-4", type: "default"}, { amount: 10n, bucketCode: "come-4", type: "odds"}  ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "come-4", type: "default"}, { amount: 10n, bucketCode: "come-4", type: "odds"}  ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "come-10", type: "default"}, { amount: 10n, bucketCode: "come-10", type: "odds"}  ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-come-points", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "come-4", type: "default"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, bucketCode: "come-8", type: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringMatching('come'));
  });
});

test("buildBetResults.lose-come-points-with-odds", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "come-4", type: "default"}, { amount: 10n, bucketCode: "come-4", type: "odds"} ], 4),
    buildTestResults({a:4, b:3, total:7}, [ { amount: 5n, bucketCode: "come-9", type: "default"}, { amount: 10n, bucketCode: "come-9", type: "odds"}  ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);

    const foundOddsBet = result.losers.find(x => x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});

test("buildBetResults.win-dont-come-points", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, bucketCode: "dontCome-8", type: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringMatching('dontCome'));
  });
});

test("buildBetResults.win-dont-come-points-with-odds", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"}, { amount: 10n, bucketCode: "dontCome-4", type: "odds"} ], 4),
    buildTestResults({a:4, b:3, total:7}, [ { amount: 5n, bucketCode: "dontCome-9", type: "default"}, { amount: 10n, bucketCode: "dontCome-9", type: "odds"}  ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);

    const foundOddsBet = result.winners.find(x => x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});

test("buildBetResults.push-dont-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "dontCome-5", type: "default"}, { amount: 10n, bucketCode: "dontCome-5", type: "odds"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"}, { amount: 10n, bucketCode: "dontCome-4", type: "odds"}  ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"}, { amount: 10n, bucketCode: "dontCome-4", type: "odds"}  ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"}, { amount: 10n, bucketCode: "dontCome-4", type: "odds"}  ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "dontCome-10", type: "default"}, { amount: 10n, bucketCode: "dontCome-10", type: "odds"}  ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-dont-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "dontCome-9", type: "default"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringMatching('dontCome'));
  });
});

test("buildBetResults.lose-dont-come-points-with-odds", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"}, { amount: 10n, bucketCode: "dontCome-4", type: "odds"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "dontCome-4", type: "default"}, { amount: 10n, bucketCode: "dontCome-4", type: "odds"}  ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "dontCome-9", type: "default"}, { amount: 10n, bucketCode: "dontCome-9", type: "odds"}  ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);

    const foundOddsBet = result.losers.find(x => x.type === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});


test("buildBetResults.win-place", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-4", type: "default"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-4", type: "default"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "place-9", type: "default"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.push-place", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-5", type: "default"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, bucketCode: "place-4", type: "default"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "place-4", type: "default"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "place-4", type: "default"} ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "place-10", type: "default"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-place", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "place-4", type: "default"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, bucketCode: "place-8", type: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.win-place-buy", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-4", type: "buy"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-4", type: "buy"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "place-9", type: "buy"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.push-place-buy", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-5", type: "buy"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, bucketCode: "place-4", type: "buy"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "place-4", type: "buy"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "place-4", type: "buy"} ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "place-10", type: "buy"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-place-buy", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "place-4", type: "buy"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, bucketCode: "place-8", type: "buy"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.win-place-lay", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, bucketCode: "place-4", type: "lay"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, bucketCode: "place-8", type: "lay"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.push-place-lay", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-5", type: "lay"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, bucketCode: "place-4", type: "lay"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "place-4", type: "lay"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, bucketCode: "place-4", type: "lay"} ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "place-10", type: "lay"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-place-lay", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-4", type: "lay"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, bucketCode: "place-4", type: "lay"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, bucketCode: "place-9", type: "lay"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.win-horn", () => {

  [
    buildTestResults({a:1, b:1, total:2}, [ hornBetFunc(2) ]),
    buildTestResults({a:1, b:2, total:3}, [ hornBetFunc(3) ], 4),
    buildTestResults({a:6, b:6, total:12}, [ hornBetFunc(12) ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].bucketCode).toEqual(expect.stringMatching('horn'));
  });
});

test("buildBetResults.lose-horn", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ hornBetFunc(3) ], 6),
    buildTestResults({a:5, b:4, total:9}, [ hornBetFunc(11) ], 8),
    buildTestResults({a:6, b:4, total:10}, [ hornBetFunc(12) ], 5),
    buildTestResults({a:5, b:6, total:11}, [ hornBetFunc(12) ]),
    buildTestResults({a:1, b:4, total:5}, [ hornBetFunc(12) ]),
    buildTestResults({a:4, b:2, total:6}, [ hornBetFunc(12) ]),
    buildTestResults({a:4, b:4, total:8}, [ hornBetFunc(12) ], 8),
    buildTestResults({a:3, b:4, total:7}, [ hornBetFunc(12) ], 8),
    buildTestResults({a:1, b:6, total:7}, [ hornBetFunc(2) ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].bucketCode).toEqual(expect.stringMatching('horn'));
  });
});

// TODO multi-bets
