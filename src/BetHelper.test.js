import { RollUtils } from "./RollUtils";
import BetHelper from "./BetHelper";

const rollUtils = new RollUtils();

const betHelper = new BetHelper();

test("buildBetResults.pass-line", () => {
  const roll = { a: 3, b: 4, total: 7 };
  
  const crapsMeta = rollUtils.buildCrapsResult(roll);
  
  let testFrame = {
    roll: roll,
    crapsMeta: crapsMeta,
    activeBets: [ { amount: 5n, bucketCode: "pass", type: "default"} ]
  };
  
  const result = betHelper.buildBetResults(testFrame);
  
  console.log(`result.winners = ${JSON.stringify(betHelper.betsAsJsonFriendly(result.winners))}`);
  
  expect(result.winners.length).toEqual(1);
  expect(result.winners[0].bucketCode).toEqual("pass");  
});
