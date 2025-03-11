import { RollUtils } from "./RollUtils";
import BetHelper from "./BetHelper";

const rollUtils = new RollUtils();

const betHelper = new BetHelper();

const fieldBet = { amount: 5n, groupCode: "field", option: "default"};

const anyCrapsBet = { amount: 5n, groupCode: "anyCraps", option: "default"};

const c_and_e_Bet = { amount: 5n, groupCode: "c-and-e", option: "default"};

const anySevenBet = { amount: 5n, groupCode: "anySeven", option: "default"};

const comeBet = { amount: 5n, groupCode: "come", option: "default" };

const dontComeBet = { amount: 5n, groupCode: "dontCome", option: "default" };

const hornBetFunc = (val) => { return { amount: 5n, groupCode: `horn-${val}`, option: "default" } };

const buildHandleBetsResults = (
    roll = { a: 3, b: 4, total: 7 },
    incomingBets = [],
    existingPoint = 0 ) => {

      // set a bucketCode on each bet
      const activeBets = incomingBets.map( bet => { return {...bet, bucketCode: `${bet.groupCode}-${bet.option}`};});

      return betHelper.handleBetsForRoll({
        roll: roll,
        crapsMeta: rollUtils.buildCrapsResult(roll, existingPoint),
        activeBets: activeBets
      });
   };

test("handleBetsForRoll.lose-clearBet", () => {
  [
    buildHandleBetsResults({a:2, b:2, total:4}, [ hornBetFunc(3) ], 6),
    buildHandleBetsResults({a:5, b:4, total:9}, [ hornBetFunc(11) ], 8),
    buildHandleBetsResults({a:5, b:4, total:9}, [ anySevenBet ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(1);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(0);
  });
});

test("handleBetsForRoll.win-simpleBets", () => {
  [
    buildHandleBetsResults({a:2, b:1, total:3}, [ hornBetFunc(3) ], 6),
    buildHandleBetsResults({a:5, b:6, total:11}, [ hornBetFunc(11) ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('horn'));
    expect(result.payouts[0].amount).toEqual(75n);
  });

  [
    buildHandleBetsResults({a:2, b:1, total:2}, [ hornBetFunc(2) ]),
    buildHandleBetsResults({a:5, b:6, total:12}, [ hornBetFunc(12) ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('horn'));
    expect(result.payouts[0].amount).toEqual(150n);
  });

  [
    buildHandleBetsResults({a:3, b:4, total:7}, [ anySevenBet ], 4),
    buildHandleBetsResults({a:1, b:6, total:7}, [ anySevenBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual("anySeven-default");
    expect(result.payouts[0].amount).toEqual(20n);
  });

  [
    buildHandleBetsResults({a:2, b:1, total:3}, [ anyCrapsBet ], 4),
    buildHandleBetsResults({a:6, b:6, total:12}, [ anyCrapsBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual("anyCraps-default");
    expect(result.payouts[0].amount).toEqual(35n);
  });

  [
    buildHandleBetsResults({a:2, b:2, total:4}, [ { amount: 5n, groupCode: "hardWay-4", option: "default"} ], 6),
    buildHandleBetsResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "hardWay-10", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('hardWay'));
    expect(result.payouts[0].amount).toEqual(35n);
  });

  [
    buildHandleBetsResults({a:4, b:4, total:8}, [ { amount: 5n, groupCode: "hardWay-8", option: "default"} ], 6),
    buildHandleBetsResults({a:3, b:3, total:6}, [ { amount: 5n, groupCode: "hardWay-6", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('hardWay'));
    expect(result.payouts[0].amount).toEqual(45n);
  });
});

test("handleBetsForRoll.win-field", () => {
  [
    buildHandleBetsResults({a:2, b:1, total:3}, [ fieldBet ], 6),
    buildHandleBetsResults({a:5, b:6, total:11}, [ fieldBet ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual("field-default");
    expect(result.payouts[0].amount).toEqual(5n);
  });

  [
    buildHandleBetsResults({a:1, b:1, total:2}, [ fieldBet ], 4),
    buildHandleBetsResults({a:6, b:6, total:12}, [ fieldBet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual("field-default");
    expect(result.payouts[0].amount).toEqual(10n);
  });
});

test("handleBetsForRoll.win-place", () => {
  [
    buildHandleBetsResults({a:3, b:1, total:4}, [ { amount: 5n, groupCode: "place-4", option: "default"} ]),
    buildHandleBetsResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "place-10", option: "default"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('place'));
    expect(result.payouts[0].amount).toEqual(9n);
  });

  [
    buildHandleBetsResults({a:3, b:2, total:5}, [ { amount: 15n, groupCode: "place-5", option: "default"} ]),
    buildHandleBetsResults({a:3, b:6, total:9}, [ { amount: 15n, groupCode: "place-9", option: "default"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('place'));
    expect(result.payouts[0].amount).toEqual(21n);
  });

  [
    buildHandleBetsResults({a:1, b:5, total:6}, [ { amount: 15n, groupCode: "place-6", option: "default"} ]),
    buildHandleBetsResults({a:4, b:4, total:8}, [ { amount: 15n, groupCode: "place-8", option: "default"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('place'));
    expect(result.payouts[0].amount).toEqual(17n);
  });
});

test("handleBetsForRoll.push-place", () => {
  [
    buildHandleBetsResults({a:3, b:5, total:8}, [ { amount: 5n, groupCode: "place-4", option: "default"} ]),
    buildHandleBetsResults({a:5, b:1, total:6}, [ { amount: 5n, groupCode: "place-10", option: "default"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('place'));
    expect(result.payouts.length).toEqual(0);
  });

});

test("handleBetsForRoll.push-hardWays", () => {
  [
    buildHandleBetsResults({a:3, b:5, total:8}, [ { amount: 5n, groupCode: "hardWay-4", option: "default"} ]),
    buildHandleBetsResults({a:5, b:1, total:6}, [ { amount: 5n, groupCode: "hardWay-10", option: "default"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual(expect.stringMatching('hardWay'));
    expect(result.payouts.length).toEqual(0);
  });

});

test("handleBetsForRoll.win-c-and-e", () => {
  [
    buildHandleBetsResults({a:2, b:1, total:3}, [ c_and_e_Bet ], 6),
    buildHandleBetsResults({a:6, b:6, total:12}, [ c_and_e_Bet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual("c-and-e-default");
    expect(result.payouts[0].amount).toEqual(15n);
  });

  [
    buildHandleBetsResults({a:5, b:6, total:11}, [ c_and_e_Bet ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets[0].id).toEqual("c-and-e-default");
    expect(result.payouts[0].amount).toEqual(35n);
  });
});

test("handleBetsForRoll.win-pass-line-point-hit", () => {
  [
    buildHandleBetsResults({a:2, b:4, total:6}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 6),
    buildHandleBetsResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 4),
    buildHandleBetsResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 10),
    buildHandleBetsResults({a:3, b:6, total:9}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("10");
  });
});

test("handleBetsForRoll.win-pass-line-no-point", () => {
  [
    buildHandleBetsResults({a:3, b:4, total:7}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
    buildHandleBetsResults({a:1, b:6, total:7}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
    buildHandleBetsResults({a:5, b:6, total:11}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("10");
  });
});

test("handleBetsForRoll.win-dont-pass-bar-no-point", () => {
  [
    buildHandleBetsResults({a:2, b:1, total:3}, [ { amount: 5n, groupCode: "dontPass", option: "default"} ]),
    buildHandleBetsResults({a:1, b:1, total:2}, [ { amount: 5n, groupCode: "dontPass", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("10");
  });
});

test("handleBetsForRoll.push-pass-line", () => {
  [
    buildHandleBetsResults({a:2, b:4, total:6}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 9),
    buildHandleBetsResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "pass", option: "default"} ], 6),
    buildHandleBetsResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "pass", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(1);
    expect(result.payouts.length).toEqual(0);
  });

  [
    buildHandleBetsResults({a:2, b:4, total:6}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 9),
    buildHandleBetsResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 6),
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(2);
    expect(result.payouts.length).toEqual(0);
  });
});

test("handleBetsForRoll.win-pass-line-with-odds-point-hit", () => {
  [
    buildHandleBetsResults({a:2, b:4, total:6}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 6),
    buildHandleBetsResults({a:5, b:3, total:8}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("32");
    expect(result.payouts[0].code).toEqual("pass-default");
  });

  [
    buildHandleBetsResults({a:2, b:3, total:5}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 5),
    buildHandleBetsResults({a:5, b:4, total:9}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("35");
  });

  [
    buildHandleBetsResults({a:1, b:3, total:4}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 4),
    buildHandleBetsResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "pass", option: "default"}, { amount: 10n, groupCode: "pass", option: "odds"} ], 10)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("40");
  });
});

test("handleBetsForRoll.win-dont-pass-with-odds-line-away", () => {
  [
    buildHandleBetsResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 12n, groupCode: "dontPass", option: "odds"} ], 6),
    buildHandleBetsResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 12n, groupCode: "dontPass", option: "odds"} ], 8)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("32");
    expect(result.payouts[0].code).toEqual("dontPass-default");
  });

  [
    buildHandleBetsResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 12n, groupCode: "dontPass", option: "odds"} ], 5),
    buildHandleBetsResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 12n, groupCode: "dontPass", option: "odds"} ], 9)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("30");
  });

  [
    buildHandleBetsResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 12n, groupCode: "dontPass", option: "odds"} ], 4),
    buildHandleBetsResults(undefined, [ { amount: 5n, groupCode: "dontPass", option: "default"}, { amount: 12n, groupCode: "dontPass", option: "odds"} ], 10)
  ].forEach( result => {
    expect(result.winners.length).toEqual(2);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("28");
  });
});

test("handleBetsForRoll.win-come-no-point", () => {
  [
    buildHandleBetsResults({a:3, b:4, total:7}, [ { amount: 5n, groupCode: "come", option: "default"} ]),
    buildHandleBetsResults({a:1, b:6, total:7}, [ { amount: 5n, groupCode: "come", option: "default"} ]),
    buildHandleBetsResults({a:5, b:6, total:11}, [ { amount: 5n, groupCode: "come", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("10");
  });
});

test("handleBetsForRoll.win-dont-come-no-point", () => {
  [
    buildHandleBetsResults({a:2, b:1, total:3}, [ { amount: 5n, groupCode: "dontCome", option: "default"} ]),
    buildHandleBetsResults({a:1, b:1, total:2}, [ { amount: 5n, groupCode: "dontCome", option: "default"} ]),
  ].forEach( result => {
    expect(result.winners.length).toEqual(1);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(0);
    expect(result.payouts.length).toEqual(1);
    expect(result.payouts[0].amount.toString()).toEqual("10");
  });
});

test("handleBetsForRoll.come-point-set", () => {

  [
    buildHandleBetsResults({a:2, b:3, total:5}, [ { amount: 5n, groupCode: "come", option: "default"} ], 6),
    buildHandleBetsResults({a:1, b:4, total:5}, [ { amount: 5n, groupCode: "come", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(1);
    expect(result.updatedBets[0].bucketCode).toEqual("come-5-default");
    expect(result.updatedBets[0].groupCode).toEqual("come-5");
    expect(result.payouts.length).toEqual(0);
  });

  const result = buildHandleBetsResults({a:5, b:3, total:8}, [ { amount: 5n, groupCode: "come", option: "default"} ], 8);
  expect(result.winners.length).toEqual(0);
  expect(result.losers.length).toEqual(0);
  expect(result.updatedBets.length).toEqual(1);
  expect(result.updatedBets[0].bucketCode).toEqual("come-8-default");
  expect(result.payouts.length).toEqual(0);
});

test("handleBetsForRoll.dont-come-point-set", () => {

  [
    buildHandleBetsResults({a:4, b:6, total:10}, [ { amount: 5n, groupCode: "dontCome", option: "default"} ], 6),
    buildHandleBetsResults({a:5, b:5, total:10}, [ { amount: 5n, groupCode: "dontCome", option: "default"} ])
  ].forEach( result => {
    expect(result.winners.length).toEqual(0);
    expect(result.losers.length).toEqual(0);
    expect(result.updatedBets.length).toEqual(1);
    expect(result.updatedBets[0].bucketCode).toEqual("dontCome-10-default");
    expect(result.payouts.length).toEqual(0);
  });

  const result = buildHandleBetsResults({a:3, b:3, total:6}, [ { amount: 5n, groupCode: "dontCome", option: "default"} ], 6);
  expect(result.winners.length).toEqual(0);
  expect(result.losers.length).toEqual(0);
  expect(result.updatedBets.length).toEqual(1);
  expect(result.updatedBets[0].bucketCode).toEqual("dontCome-6-default");
  expect(result.payouts.length).toEqual(0);
});


// ===================================================================
