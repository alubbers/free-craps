import {POINTS, PASS, DONT_PASS, COME, DONT_COME, HARD_WAYS, ANY_CRAPS, C_AND_E, HORN, ANY_SEVEN, FIELD, PLACE} from './CrapsConstants';
import {POINT_STATES} from './RollUtils';

const SimplePayouts = new Map();
SimplePayouts.set(HORN.codeFunc(3), 15n);
SimplePayouts.set(HORN.codeFunc(11), 15n);
SimplePayouts.set(HORN.codeFunc(2), 30n);
SimplePayouts.set(HORN.codeFunc(12), 30n);
SimplePayouts.set(ANY_SEVEN.codeFunc(), 4n);
SimplePayouts.set(ANY_CRAPS.codeFunc(), 7n);


/*
 * This class contains utility methods around determining wins/losses with bets
 * given a particular craps roll result
 */
class BetHelper {

  betsAsJsonFriendly(betsToFormat) {
    return betsToFormat.map( b => this.betAsJsonFriendly(b));
  }

  betAsJsonFriendly(betToFormat) {
    let temp = { ...betToFormat, amount: "" };
    if (betToFormat.amount) {
      temp.amount = betToFormat.amount.toString();
    }

    return temp;
  }

  _pushIfNotEmpty(array, element) {
    if (element) {
      array.push(element);
    }
  }

  /**
   * Build a map with details on the winning and losing bets on a craps roll
   *
   * @param rollFrame a map of 3 properties: {
   *   roll:  The roll result from RollUtils
   *   crapsMeta:  The metadata about the roll result -- See RollUtils.buildCrapsResult for more details
   *   activeBets: the working bets in place for the roll
   * }
   *
   * @return {
   *   winners: an array of all the bets that won
   *   losers: an array of all the bets that lost
   * }
   */
  buildBetResults(rollFrame) {
    let result = {
      totalBankChange: 0,
      winners: [],
      losers: []
    };

    const crapsMeta = rollFrame.crapsMeta;

    const rollTotal = rollFrame.roll.total;

    // map the valid bets by bucket code and type
    let mappedBets = {};
    let mappedBetIds = [];

    // filter out bets of no amount
    rollFrame.activeBets.filter( bet => bet.amount !== 0n).forEach( bet => {
      const id = bet.bucketCode;
      mappedBets[id] = {...bet, id: id};
      mappedBetIds.push(id);
    });

    // let of bet ids that clear away after losing
    let removedBetIds = [];

    // inner utility function
    let markBetLoser = (code) => {
      const bet = mappedBets[code];

      this._pushIfNotEmpty(removedBetIds, bet ? bet.id : undefined);
      this._pushIfNotEmpty(result.losers, bet);
    };

    let markBetWinner = (code) => {
      const bet = mappedBets[code];

      if (!removedBetIds.includes(code)) {
        this._pushIfNotEmpty(result.winners, bet);
      }
    }

    if (crapsMeta.craps) {
      markBetLoser(PASS.codeFunc());
      markBetLoser(COME.codeFunc());

      // Traditionally, a don't pass bet on a 12 is a 'push' , i.e. a tie, so it doesn't win or lose
      if (rollFrame.roll.total !== 12) {
        markBetWinner(DONT_PASS.codeFunc());
        markBetWinner(DONT_COME.codeFunc());
      }
    }
    else {
      // check for all conditions for a roll of 7 below, just check for the 11 here
      if (crapsMeta.passLineWin && rollTotal === 11) {
        markBetWinner(PASS.codeFunc());
        markBetWinner(COME.codeFunc());

        markBetLoser(DONT_PASS.codeFunc());
        markBetLoser(DONT_COME.codeFunc());
      }
      else {
        if (crapsMeta.pointState === POINT_STATES.pointHit) {
          // if the point is hit, the pass line default and odds bet both win
          markBetWinner(PASS.codeFunc());
          markBetWinner(PASS.codeFunc(undefined, "odds"));

          markBetLoser(DONT_PASS.codeFunc());
          markBetLoser(DONT_PASS.codeFunc(undefined, "odds"));
        }
      }
    }

    // Since all given bets are assumed to be working,
    // gather up anything else that wins and loses on a seven in one place
    if (rollTotal === 7) {
      /*
           if 7 is rolled, and your bet is working, it loses, except these, which all win:
           any don't come bets on any points ( default and odds )
           the default come bet
           any seven
           place lay bets

           If the point was set when 7 was rolled, then any don't pass bets win ( default and odds )
           If the point was off, then any pass bets win ( default only valid  when point off )
      */

      let winningIds = [
        COME.codeFunc(),
        ANY_SEVEN.codeFunc()
      ];

      POINTS.forEach( pointNum => {
        winningIds.push(DONT_COME.codeFunc(pointNum, "default"));
        winningIds.push(DONT_COME.codeFunc(pointNum, "odds"));
        winningIds.push(PLACE.codeFunc(pointNum, "lay"));
      });

      if (crapsMeta.pointState === POINT_STATES.lineAway) {
        winningIds.push(DONT_PASS.codeFunc());
        winningIds.push(DONT_PASS.codeFunc(undefined, "odds"));
      }
      else {
        winningIds.push(PASS.codeFunc());
      }

      mappedBetIds.forEach( id => {
        if (winningIds.includes(id)) {
          markBetWinner(id);
        }
        else {
          markBetLoser(id);
        }
      });
    }
    else {
      // Any Seven is a one time bet, so if the roll isn't a 7, it loses
      markBetLoser(ANY_SEVEN.codeFunc());
    }

    // Hard ways
    if (HARD_WAYS.values.includes(rollTotal)) {
      const hardId = HARD_WAYS.codeFunc(rollTotal);

      // if the bet isn't already determined to be a loser
      if (!removedBetIds.includes(hardId)) {
        if (crapsMeta.hardWay) {
          markBetWinner(hardId);
        }
        else {
          markBetLoser(hardId);
        }
      }
    }

    // check one-time group bets
    [FIELD, C_AND_E, ANY_CRAPS].forEach( betZone => {
      const betId = betZone.codeFunc();

      // don't bother checking if it's already lost
      if (!removedBetIds.includes(betId)) {
        if (betZone.values.includes(rollTotal)) {
          markBetWinner(betId);
        }
        else {
          markBetLoser(betId);
        }
      }
    });

    // check horn bets
    HORN.values.forEach( hornVal => {
      const betId = HORN.codeFunc(hornVal);

      if (!removedBetIds.includes(betId)) {
        if (rollTotal === hornVal) {
          markBetWinner(betId);
        }
        else {
          markBetLoser(betId);
        }
      }
    });

    // check for a place bet, which don't lose if the chosen value is missed
    if (PLACE.values.includes(rollTotal)) {
      markBetWinner(PLACE.codeFunc(rollTotal));
      markBetWinner(PLACE.codeFunc(rollTotal, 'buy'));
      markBetLoser(PLACE.codeFunc(rollTotal, 'lay'));
    }

    // check for a come or don't come bet if a point number was rolled
    if (POINTS.includes(rollTotal)) {
      markBetWinner(COME.codeFunc(rollTotal));
      markBetWinner(COME.codeFunc(rollTotal, 'odds'));
      markBetLoser(DONT_COME.codeFunc(rollTotal));
      markBetLoser(DONT_COME.codeFunc(rollTotal, 'odds'));
    }

    return result;
  }

  /**
   * Return information on updated bets, winners, losers, and total bank onChange
   * for a craps roll and a set of bets.
   *
   * All the given bets are assumed to be working.
   *
   * @param rollFrame a map of 3 properties: {
   *   roll:  The roll result from RollUtils
   *   crapsMeta:  The metadata about the roll result -- See RollUtils.buildCrapsResult for more details
   *   activeBets: the working bets in place for the roll
   * }
   *
   * @return {
   *   winners: an array of all the bets that won
   *   losers: an array of all the bets that lost
   *   updatedBets: a map of active bets that would replace the given bets
   *   payouts: an array of objects one for each winning bet
   *       {
   *         bucketCode: the bet bucket code
   *         amount: winnings from the bet
   *       }
   * }
   */
  handleBetsForRoll(rollFrame) {
    const betResults = this.buildBetResults(rollFrame);

    const rollTotal = rollFrame.roll.total;


    let mappedWinners = [];
    let mappedLosers = [];


    betResults.winners.forEach( bet => {
      mappedWinners[bet.id] = bet;
    });

    betResults.losers.forEach( bet => {
      mappedLosers[bet.id] = bet;
    });

    let mappedBets = {};
    let printableMappedBets = {};
    let mappedBetIds = [];

    // filter out bets of no amount
    rollFrame.activeBets.filter( bet => bet.amount !== 0n).forEach( bet => {
      const id = bet.bucketCode;
      mappedBets[id] = {...bet, id: id};
      printableMappedBets[bet.id] = this.betAsJsonFriendly(bet);
      mappedBetIds.push(id);
    });

    let result = {
      ...betResults,
      updatedBets: [],
      payouts: []
    };

    // Handle simple payouts.  These all just clear the bet on loss
    SimplePayouts.forEach( (multiplier, code) => {
      const simpleWinner = mappedWinners[code];

      if (simpleWinner) {
        result.updatedBets.push(simpleWinner);
        result.payouts.push({
          bucketCode: code,
          amount: simpleWinner.amount * multiplier
        });
      }
    });

    // Handle Field bets, with 2 and 12 being double payouts
    const fieldWinner = mappedWinners[FIELD.codeFunc()];
    if (fieldWinner) {
      let multiplier = 1n;
      if (rollTotal === 2 || rollTotal === 12) {
        multiplier = 2n;
      }
      result.updatedBets.push(fieldWinner);
      result.payouts.push({
        bucketCode: fieldWinner.id,
        amount: fieldWinner.amount * multiplier
      });
    }

    // Hard ways
    HARD_WAYS.values.map(p => HARD_WAYS.codeFunc(p)).forEach(code => {
      const winner = mappedWinners[code];
      if (winner) {
        // default the multiplier for 6 and 8, and modify otherwise
        let multiplier = 9n;
        if (rollTotal === 4 || rollTotal === 10) {
          multiplier = 7n;
        }

        result.updatedBets.push(winner);

        result.payouts.push({
          bucketCode: winner.id,
          amount: winner.amount * multiplier
        })
      }
      else if (!mappedLosers[code] && mappedBets[code]) {
        // if not a losing bet, keep the place bet in the set of new bets
        result.updatedBets.push(mappedBets[code]);
      }
    });

    // Place bets
    POINTS.map(p => PLACE.codeFunc(p)).forEach(code => {
      const winner = mappedWinners[code];
      if (winner) {
        // default the multiplier for 6 and 8, and modify otherwise
        let multiplier = {
          rate: 7n,
          forEvery: 6n
        }
        switch(rollTotal) {
          case 4:
          case 10: {
            multiplier = {
              rate: 9n,
              forEvery: 5n
            }
            break;
          }
          case 5:
          case 9: {
            multiplier = {
              rate: 7n,
              forEvery: 5n
            }
            break;
          }
          default: {
            throw new Error(`Should not have a place winner for a roll total of ${rollTotal}`);
          }
        }

        result.updatedBets.push(winner);

        result.payouts.push({
          bucketCode: winner.id,
          amount: this.calculatePayoutWithMultiplier(winner.amount, multiplier)
        })
      }
      else if (!mappedLosers[code] && mappedBets[code]) {
        // if not a losing bet, keep the bet in the set of new bets
        result.updatedBets.push(mappedBets[code]);
      }
    });

    // Handle C AND E bets
    const cAndEWinner = mappedWinners[C_AND_E.codeFunc()];
    if (cAndEWinner) {
      // C and E wins on Craps ( 2, 3, or 12 ) or 11
      // Craps wins at 3:1 , 11 wins at 7:1
      let multiplier = 3n;
      if (rollTotal === 11) {
        multiplier = 7n;
      }
      result.updatedBets.push(cAndEWinner);
      result.payouts.push({
        bucketCode: cAndEWinner.id,
        amount: cAndEWinner.amount * multiplier
      });
    }

    const passLineOddsMultipliers = {};
    passLineOddsMultipliers[4] = { rate: 2n, forEvery: 1n };
    passLineOddsMultipliers[10] = { rate: 2n, forEvery: 1n };
    passLineOddsMultipliers[5] = { rate: 3n, forEvery: 2n };
    passLineOddsMultipliers[9] = { rate: 3n, forEvery: 2n };
    passLineOddsMultipliers[6] = { rate: 6n, forEvery: 5n };
    passLineOddsMultipliers[8] = { rate: 6n, forEvery: 5n };

    // Handle Pass Line
    // For this bet, pay back the bet amounts and winnings together, and group the payout under the pass line default code
    let passLinePayout = 0n;

    [ { code: PASS.codeFunc(), bet: mappedWinners[PASS.codeFunc()], multiplier: { rate: 1n, forEvery: 1n } },
      { code: PASS.codeFunc(undefined, "odds"), bet: mappedWinners[PASS.codeFunc(undefined, "odds")], multiplier: passLineOddsMultipliers[rollTotal]}
    ].forEach( winnerCheck => {
      if (winnerCheck.bet) {
        // pay the original bet and the winnings, since the bet will be cleared afterwards
        passLinePayout += winnerCheck.bet.amount;
        passLinePayout += this.calculatePayoutWithMultiplier(winnerCheck.bet.amount, winnerCheck.multiplier);
      }
      else if (!mappedLosers[winnerCheck.code] && mappedBets[winnerCheck.code]) {
        // if not a losing bet, keep the place bet in the set of new bets
        result.updatedBets.push(mappedBets[winnerCheck.code]);
      }
    });
    if (passLinePayout > 0n) {
      result.payouts.push({
        bucketCode: PASS.codeFunc(),
        amount: passLinePayout
      });
    }

    // Handle Come bets
    let comeBetPayout = 0n;
    [ { code: COME.codeFunc(), bet: mappedWinners[COME.codeFunc()], multiplier: { rate: 1n, forEvery: 1n } },
      { code: COME.codeFunc(rollTotal), bet: mappedWinners[COME.codeFunc(rollTotal)], multiplier: { rate: 1n, forEvery: 1n } },
      { code: COME.codeFunc(rollTotal, "odds"), bet: mappedWinners[COME.codeFunc(rollTotal, "odds")], multiplier: passLineOddsMultipliers[rollTotal]},
    ].forEach( winnerCheck => {
      if (winnerCheck.bet) {
        // pay the original bet and the winnings, since the bet will be cleared afterwards
        comeBetPayout += winnerCheck.bet.amount;
        comeBetPayout += this.calculatePayoutWithMultiplier(winnerCheck.bet.amount, winnerCheck.multiplier);
      }
      else if (!mappedLosers[winnerCheck.code] && mappedBets[winnerCheck.code]) {
        // if not a winning or losing bet, check if the roll result was setting a point
        if (POINTS.includes(rollTotal)) {

          // build a new bet moving the come bet up to the new inner point
          result.updatedBets.push({
            ...mappedBets[winnerCheck.code],
            groupCode: `come-${rollTotal}`,
            bucketCode: COME.codeFunc(rollTotal)
          });
        }
        else {
          result.updatedBets.push(mappedBets[winnerCheck.code]);
        }
      }
    });
    if (comeBetPayout > 0n) {
      result.payouts.push({
        bucketCode: COME.codeFunc(),
        amount: comeBetPayout
      });
    }


    // Handle Don't Pas Bar
    // don't pass odds are the pass line odds inverted
    const dontPassOddsMultipliers = {};
    POINTS.forEach(p => {
      dontPassOddsMultipliers[`${p}`] = {
        rate: passLineOddsMultipliers[p].forEvery,
        forEvery: passLineOddsMultipliers[p].rate
      };
    });

    let dontPassPayout = 0n;

    [ { code: DONT_PASS.codeFunc(), bet: mappedWinners[DONT_PASS.codeFunc()], multiplier: { rate: 1n, forEvery: 1n } },
      { code: DONT_PASS.codeFunc(undefined, "odds"), bet: mappedWinners[DONT_PASS.codeFunc(undefined, "odds")], multiplier: dontPassOddsMultipliers[`${rollFrame.crapsMeta.oldPoint}`]}
    ].forEach( winnerCheck => {
      if (winnerCheck.bet) {
        // pay the original bet and the winnings, since the bet will be cleared afterwards
        dontPassPayout += winnerCheck.bet.amount;
        dontPassPayout += this.calculatePayoutWithMultiplier(winnerCheck.bet.amount, winnerCheck.multiplier);
      }
      else if (!mappedLosers[winnerCheck.code] && mappedBets[winnerCheck.code]) {
        // if not a losing bet, keep the place bet in the set of new bets
        result.updatedBets.push(mappedBets[winnerCheck.code]);
      }
    });
    if (dontPassPayout > 0n) {
      result.payouts.push({
        bucketCode: DONT_PASS.codeFunc(),
        amount: dontPassPayout
      });
    }


    // Handle Dont Come bets
    let dontComePayout = 0n;
    [ { code: DONT_COME.codeFunc(), bet: mappedWinners[DONT_COME.codeFunc()], multiplier: { rate: 1n, forEvery: 1n } },
      { code: DONT_COME.codeFunc(rollTotal), bet: mappedWinners[DONT_COME.codeFunc(rollTotal)], multiplier: { rate: 1n, forEvery: 1n } },
      { code: DONT_COME.codeFunc(rollTotal, "odds"), bet: mappedWinners[DONT_COME.codeFunc(rollTotal, "odds")], multiplier: dontPassOddsMultipliers[`${rollFrame.crapsMeta.oldPoint}`]},
    ].forEach( winnerCheck => {
      if (winnerCheck.bet) {
        // pay the original bet and the winnings, since the bet will be cleared afterwards
        dontComePayout += winnerCheck.bet.amount;
        dontComePayout += this.calculatePayoutWithMultiplier(winnerCheck.bet.amount, winnerCheck.multiplier);
      }
      else if (!mappedLosers[winnerCheck.code] && mappedBets[winnerCheck.code]) {
        // if not a winning or losing bet, check if the roll result was setting a point
        if (POINTS.includes(rollTotal)) {

          // build a new bet moving the come bet up to the new inner point
          result.updatedBets.push({
            ...mappedBets[winnerCheck.code],
            groupCode: `dontCome-${rollTotal}`,
            bucketCode: DONT_COME.codeFunc(rollTotal)
          });
        }
        else {
          result.updatedBets.push(mappedBets[winnerCheck.code]);
        }
      }
    });
    if (dontComePayout > 0n) {
      result.payouts.push({
        bucketCode: DONT_COME.codeFunc(),
        amount: dontComePayout
      });
    }

    // TODO Place buy and lay bets

    return result;
  }


  calculatePayoutWithMultiplier(amount, multiplier) {
    // bets with fractional multipliers are paid for each unit at the increased multiplier,
    // and 1:1 for any remainder
    const remainder = amount % multiplier.forEvery;
    const unitsPaid = ( amount / multiplier.forEvery ) * multiplier.rate;

    return unitsPaid + remainder;
  }

}

export default BetHelper;
