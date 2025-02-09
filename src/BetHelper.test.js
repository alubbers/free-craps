import { RollUtils } from "./RollUtils";
import BetHelper from "./BetHelper";

const rollUtils = new RollUtils();

const betHelper = new BetHelper();

// default to a roll of a 7 with no bets and no point set
const buildTestResults = (
    roll = { a: 3, b: 4, total: 7 },
    incomingBets = [],
    existingPoint = 0 ) => {

      // set a bucketCode on each bet
      const activeBets = incomingBets.map( bet => { return {...bet, bucketCode: `${bet.groupCode}-${bet.option}`};});

      return betHelper.buildBetResults({
        roll: roll,
        crapsMeta: rollUtils.buildCrapsResult(roll, existingPoint),
        activeBets: activeBets
      });
   };

const fieldBet = { amount: 5n, groupCode: "field", option: "default"};

const anyCrapsBet = { amount: 5n, groupCode: "anyCraps", option: "default"};

const c_and_e_Bet = { amount: 5n, groupCode: "c-and-e", option: "default"};

const anySevenBet = { amount: 5n, groupCode: "anySeven", option: "default"};

const comeBet = { amount: 5n, groupCode: "come", option: "default" };

const dontComeBet = { amount: 5n, groupCode: "dontCome", option: "default" };

const hornBetFunc = (val) => { return { amount: 5n, groupCode: `horn-${val}`, option: "default" } };


test("buildBetResults.win-pass-line-no-point", () => {

  [
    buildTestResults(undefined, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
    buildTestResults({a:5, b:2, total:7}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, groupCode: "pass", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual("pass");
  });
});

test("buildBetResults.win-pass-line-point-hit", () => {
  [
    buildTestResults({a:2, b:4, total:6}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 6),
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 4),
    buildTestResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 10),
    buildTestResults({a:3, b:6, total:9}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual("pass");
  });
});

test("buildBetResults.win-pass-line-with-odds-point-hit", () => {
  [
    buildTestResults({a:2, b:4, total:6}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 6),
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    let foundOddsBet = result.winners.find(x => x.groupCode === "pass" && x.option === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount).toEqual(10n);
  });
});

test("buildBetResults.lose-pass-line-no-point", () => {

  [
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
    buildTestResults({a:1, b:1, total:2}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
    buildTestResults({a:6, b:6, total:12}, [ { amount: 5n, groupCode: "pass", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual("pass");
  });
});

test("buildBetResults.lose-pass-line-line-away", () => {

  [
    buildTestResults(undefined, [ { amount: 5n, groupCode: "pass", option: "default"} ], 5),
    buildTestResults(undefined, [ { amount: 5n, groupCode: "pass", option: "default"} ], 8),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual("pass");
  });
});

test("buildBetResults.lose-pass-line-with-odds-line-away", () => {
  [
    buildTestResults(undefined, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 6),
    buildTestResults(undefined, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);
    let foundOddsBet = result.losers.find(x => x.groupCode === "pass" && x.option === "odds") ?? { amount: 0n };
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
    [ { amount: 5n, groupCode: "pass", option: "default"} ],
    [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ]
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
       [ { amount: 5n, groupCode: "dontPass", option: "default"} ]);

    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual("dontPass");
  });
});

test("buildBetResults.push-12-dont-pass-bar", () => {
  // on a 12, expect no winners or losers
  const result = buildTestResults( {a: 6, b: 6, total: 12},
     [ { amount: 5n, groupCode: "dontPass", option: "default"} ]);

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
    [ { amount: 5n, groupCode: "dontPass", option: "default"} ],
    [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 10n, groupCode: "dontPass", option: "odds"} ]
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
     [ { amount: 5n, groupCode: "dontPass", option: "default"} ], 10);

  expect(result.winners.length).toEqual(1);
  expect(result.losers.length).toEqual(0);
  expect(result.winners[0].groupCode).toEqual("dontPass");
});

test("buildBetResults.win-dont-pass-bar-with-odds-point-set", () => {
  [
    buildTestResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 10n, groupCode: "dontPass", option: "odds"} ], 6),
    buildTestResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 10n, groupCode: "dontPass", option: "odds"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    let foundOddsBet = result.winners.find(x => x.groupCode === "dontPass" && x.option === "odds") ?? { amount: 0n };
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
       [ { amount: 5n, groupCode: "dontPass", option: "default"} ]);

    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual("dontPass");
  });
});

test("buildBetResults.lose-dont-pass-bar-point-set", () => {
  [
    {a: 2, b: 2, total: 4},
    {a: 5, b: 3, total: 8},
    {a: 3, b: 6, total: 9}
  ].forEach(roll => {
    const result = buildTestResults( roll,
       [ { amount: 5n, groupCode: "dontPass", option: "default"} ], roll.total);

    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual("dontPass");
  });
});

test("buildBetResults.lose-dont-pass-bar-with-odds-point-set", () => {
  [
    {a: 2, b: 2, total: 4},
    {a: 5, b: 3, total: 8},
    {a: 3, b: 6, total: 9}
  ].forEach(roll => {
    const result = buildTestResults( roll,
       [ { amount: 5n, groupCode: "dontPass", option: "default"},
       { amount: 10n, groupCode: "dontPass", option: "odds"} ], roll.total);

    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);
    let foundOddsBet = result.losers.find(x => x.groupCode === "dontPass" && x.option === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});


test("buildBetResults.win-hard-ways", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "hardWay-4", option: "default"} ], 6),
    buildTestResults({a:3, b:3, total:6}, [ { amount: 5n, groupCode: "hardWay-6", option: "default"} ]),
    buildTestResults({a:4, b:4, total:8}, [ { amount: 5n, groupCode: "hardWay-8", option: "default"} ], 8),
    buildTestResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "hardWay-10", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(expect.stringContaining("hardWay-"));
  });
});

test("buildBetResults.push-hard-ways", () => {
  [
    buildTestResults({a:3, b:3, total:6}, [ { amount: 5n, groupCode: "hardWay-4", option: "default"} ], 6),
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "hardWay-6", option: "default"} ]),
    buildTestResults({a:2, b:3, total:5}, [ { amount: 5n, groupCode: "hardWay-8", option: "default"} ], 8),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "hardWay-10", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-hard-ways", () => {
  [
    buildTestResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "hardWay-4", option: "default"} ], 6),
    // lose on a 7, but only if a point is set
    buildTestResults({a:3, b:4, total:7}, [ { amount: 5n, groupCode: "hardWay-6", option: "default"} ], 5),
    buildTestResults({a:5, b:3, total:8}, [ { amount: 5n, groupCode: "hardWay-8", option: "default"} ], 8),
    buildTestResults({a:4, b:6, total:10}, [ { amount: 5n, groupCode: "hardWay-10", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual(expect.stringContaining("hardWay-"));
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
    expect(result.winners[0].groupCode).toEqual("field");
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
    expect(result.losers[0].groupCode).toEqual("field");
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
    expect(result.winners[0].groupCode).toEqual("anyCraps");
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
    expect(result.losers[0].groupCode).toEqual("anyCraps");
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
    expect(result.winners[0].groupCode).toEqual("c-and-e");
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
    expect(result.losers[0].groupCode).toEqual("c-and-e");
  });
});

test("buildBetResults.win-anySeven", () => {
  [
    buildTestResults({a:3, b:4, total:7}, [ anySevenBet ], 8),
    buildTestResults({a:1, b:6, total:7}, [ anySevenBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(anySevenBet.groupCode);
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
    expect(result.losers[0].groupCode).toEqual(anySevenBet.groupCode);
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
    expect(result.winners[0].groupCode).toEqual(comeBet.groupCode);
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
    expect(result.losers[0].groupCode).toEqual(comeBet.groupCode);
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
    expect(result.winners[0].groupCode).toEqual(dontComeBet.groupCode);
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
    expect(result.losers[0].groupCode).toEqual(dontComeBet.groupCode);
  });
});

// Test come bets that have been set on their own point
test("buildBetResults.win-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "come-4", option: "default"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "come-4", option: "default"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "come-9", option: "default"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(expect.stringMatching('come'));
  });
});

test("buildBetResults.win-come-points-with-odds", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "come-4", option: "default"}, { amount: 10n, groupCode: "come-4", option: "odds"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "come-4", option: "default"}, { amount: 10n, groupCode: "come-4", option: "odds"}  ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "come-9", option: "default"}, { amount: 10n, groupCode: "come-9", option: "odds"}  ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);

    const foundOddsBet = result.winners.find(x => x.option === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});

test("buildBetResults.push-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "come-5", option: "default"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, groupCode: "come-4", option: "default"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "come-4", option: "default"}, { amount: 10n, groupCode: "come-4", option: "odds"}  ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "come-4", option: "default"}, { amount: 10n, groupCode: "come-4", option: "odds"}  ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "come-10", option: "default"}, { amount: 10n, groupCode: "come-10", option: "odds"}  ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-come-points", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "come-4", option: "default"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, groupCode: "come-8", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual(expect.stringMatching('come'));
  });
});

test("buildBetResults.lose-come-points-with-odds", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "come-4", option: "default"}, { amount: 10n, groupCode: "come-4", option: "odds"} ], 4),
    buildTestResults({a:4, b:3, total:7}, [ { amount: 5n, groupCode: "come-9", option: "default"}, { amount: 10n, groupCode: "come-9", option: "odds"}  ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);

    const foundOddsBet = result.losers.find(x => x.option === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});

test("buildBetResults.win-dont-come-points", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, groupCode: "dontCome-8", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(expect.stringMatching('dontCome'));
  });
});

test("buildBetResults.win-dont-come-points-with-odds", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"}, { amount: 10n, groupCode: "dontCome-4", option: "odds"} ], 4),
    buildTestResults({a:4, b:3, total:7}, [ { amount: 5n, groupCode: "dontCome-9", option: "default"}, { amount: 10n, groupCode: "dontCome-9", option: "odds"}  ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);

    const foundOddsBet = result.winners.find(x => x.option === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});

test("buildBetResults.push-dont-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "dontCome-5", option: "default"}, { amount: 10n, groupCode: "dontCome-5", option: "odds"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"}, { amount: 10n, groupCode: "dontCome-4", option: "odds"}  ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"}, { amount: 10n, groupCode: "dontCome-4", option: "odds"}  ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"}, { amount: 10n, groupCode: "dontCome-4", option: "odds"}  ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "dontCome-10", option: "default"}, { amount: 10n, groupCode: "dontCome-10", option: "odds"}  ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-dont-come-points", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "dontCome-9", option: "default"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual(expect.stringMatching('dontCome'));
  });
});

test("buildBetResults.lose-dont-come-points-with-odds", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"}, { amount: 10n, groupCode: "dontCome-4", option: "odds"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "dontCome-4", option: "default"}, { amount: 10n, groupCode: "dontCome-4", option: "odds"}  ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "dontCome-9", option: "default"}, { amount: 10n, groupCode: "dontCome-9", option: "odds"}  ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(2);

    const foundOddsBet = result.losers.find(x => x.option === "odds") ?? { amount: 0n };
    expect(foundOddsBet.amount + "").toEqual(10n + "");
  });
});


test("buildBetResults.win-place", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-4", option: "default"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-4", option: "default"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "place-9", option: "default"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.push-place", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-5", option: "default"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, groupCode: "place-4", option: "default"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "place-4", option: "default"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "place-4", option: "default"} ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "place-10", option: "default"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-place", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "place-4", option: "default"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, groupCode: "place-8", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.win-place-buy", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-4", option: "buy"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-4", option: "buy"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "place-9", option: "buy"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.push-place-buy", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-5", option: "buy"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, groupCode: "place-4", option: "buy"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "place-4", option: "buy"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "place-4", option: "buy"} ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "place-10", option: "buy"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-place-buy", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "place-4", option: "buy"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, groupCode: "place-8", option: "buy"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.win-place-lay", () => {
  [
    buildTestResults({a:6, b:1, total:7}, [ { amount: 5n, groupCode: "place-4", option: "lay"} ], 4),
    buildTestResults({a:2, b:5, total:7}, [ { amount: 5n, groupCode: "place-8", option: "lay"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.winners[0].groupCode).toEqual(expect.stringMatching('place'));
  });
});

test("buildBetResults.push-place-lay", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-5", option: "lay"} ], 4),
    buildTestResults({a:6, b:5, total:11}, [ { amount: 5n, groupCode: "place-4", option: "lay"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "place-4", option: "lay"} ]),
    buildTestResults({a:1, b:2, total:3}, [ { amount: 5n, groupCode: "place-4", option: "lay"} ], 10),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "place-10", option: "lay"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
  });
});

test("buildBetResults.lose-place-lay", () => {
  [
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-4", option: "lay"} ], 4),
    buildTestResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "place-4", option: "lay"} ]),
    buildTestResults({a:6, b:3, total:9}, [ { amount: 5n, groupCode: "place-9", option: "lay"} ], 4)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.losers[0].groupCode).toEqual(expect.stringMatching('place'));
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
    expect(result.winners[0].groupCode).toEqual(expect.stringMatching('horn'));
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
    expect(result.losers[0].groupCode).toEqual(expect.stringMatching('horn'));
  });
});

test("buildBetResults.multi-bets", () => {

  let multiResult = buildTestResults({a:1, b:1, total:2}, [ hornBetFunc(2), fieldBet, comeBet ]);

  expect(multiResult.winners.length).toEqual(2);
  expect(multiResult.losers.length).toEqual(1);
  expect(multiResult.losers[0].groupCode).toEqual('come');

  multiResult = buildTestResults({a:2, b:2, total:4}, [
    { amount: 5n, groupCode: "place-4", option: "lay"},
    { amount: 5n, groupCode: "pass", option: "default"},
    { amount: 5n, groupCode: "pass", option: "odds"},
    fieldBet ], 4);

  expect(multiResult.winners.length).toEqual(3);
  expect(multiResult.losers.length).toEqual(1);

  multiResult.winners.forEach(winner => {
    if(winner.groupCode !== 'field') {
      expect(winner.groupCode).toEqual('pass');
    }
  });

});
