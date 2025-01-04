import {POINTS, PASS, DONT_PASS, COME, DONT_COME, HARD_WAYS, ANY_CRAPS, C_AND_E, HORN, ANY_SEVEN, FIELD, PLACE} from './CrapsConstants';
import {POINT_STATES} from './RollUtils';

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
   * Build a map with details on the betting results of the given roll.
   *
   * @param rollFrame a map of 3 properties:
   *   roll:  The roll result from RollUtils
   *   crapsMeta:  The metadata about the roll result -- See RollUtils.buildCrapsResult for more details
   *   activeBets: the working bets in place for the roll
   *
   * @return {
   *   totalBankChange: total change in bank from all bets for the roll
   *   winners: an array of all the bets that won
   *   losers: an array of all the bets that lost
   *   updatedBets: an array of what the activeBets have morphed into as a result of the roll
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

    // map the bets by bucket code and type
    let mappedBets = {};
    let printableMappedBets = {};
    let mappedBetIds = [];
    rollFrame.activeBets.forEach( bet => {
      const id = `${bet.bucketCode}-${bet.type}`;
      mappedBets[id] = {...bet, id: id};
      printableMappedBets[id] = this.betAsJsonFriendly({...bet, id: id});
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

    // check one-time bets
    [FIELD, C_AND_E, ANY_CRAPS, HORN].forEach( betZone => {
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
      else {
      }
    });

    // check for a place bet, which don't lose if the chosen value is missed
    if (PLACE.values.includes(rollTotal)) {
      markBetWinner(PLACE.codeFunc(rollTotal));
      markBetWinner(PLACE.codeFunc(rollTotal, 'buy'));
    }

    // check for a come or don't come bet if a point number was rolled
    if (POINTS.includes(rollTotal)) {
      markBetWinner(COME.codeFunc(rollTotal));
      markBetWinner(COME.codeFunc(rollTotal, 'odds'));
      markBetLoser(DONT_COME.codeFunc(rollTotal));
      markBetLoser(DONT_COME.codeFunc(rollTotal, 'odds'));
    }


    // TODO update removedBetIds  ( odds after pass line win )

    // create updatedBets ( other func )


    return result;
  }

}

export default BetHelper;
