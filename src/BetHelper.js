import {HARD_WAYS, ANY_CRAPS, C_AND_E, FIELD_VALUES} from './CrapsTableStore';

/*
 * This class contains utility methods around determining wins/losses with bets
 * given a particular craps roll result
 */
class BetHelper {

  betsAsJsonFriendly(betsToFormat) {
    return betsToFormat.map((b) => {
       let temp = { ...b, amount: "" };
       if (b.amount) {
         temp.amount = b.amount.toString();
       }

       return temp;
      });
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
   *   activeBets: the bets in place for the roll
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
      losers: [],
      updatedBets: rollFrame.activeBets.map( e => { return { ...e, id: `${e.bucketCode}-${e.type}`}; } )
    };

    const crapsMeta = rollFrame.crapsMeta;

    // map the bets by bucket code and type
    let mappedBets = {};
    let mappedBetIds = [];
    result.updatedBets.forEach( bet => {
      mappedBets[bet.id] = bet;
      mappedBetIds.push(bet.id);
    });

    // let of bet ids that clear away after losing
    let removedBetIds = [];

    // inner utility function
    let markBetLoser = (code) => {
      const bet = mappedBets[code];

      this._pushIfNotEmpty(removedBetIds, bet ? bet.id : undefined);
      this._pushIfNotEmpty(result.losers, bet);
    };

    const passLineBet = mappedBets["pass-default"];
    const dontPassBet = mappedBets["dontPass-default"];
    if (crapsMeta.craps) {
      markBetLoser("pass-default");

      // Traditionally, a don't pass bet on a 12 is a 'push' , i.e. a tie, so it doesn't win or lose
      if (rollFrame.roll.total !== 12) {
        this._pushIfNotEmpty(result.winners, dontPassBet);
      }
    }
    else {
      if (crapsMeta.passLineWin) {
        this._pushIfNotEmpty(result.winners, passLineBet);
        this._pushIfNotEmpty(result.winners, mappedBets["come-default"]);

        markBetLoser("dontPass-default");
        markBetLoser("dontCome-default");
      }
      else {
        if (crapsMeta.pointState === "POINT_HIT") {
          this._pushIfNotEmpty(result.winners, passLineBet);

          markBetLoser("dontPass-default");
          markBetLoser("come-default");
        }

        if (crapsMeta.pointState === "LINE_AWAY") {
          // the only bets that win are the don't pass,
          // the default come bar,
          // non-default don't come bets, ( TODO )
          // lay bets, ( TODO )
          // and Any Seven
          const winningIds = [
            "dontPass-default",
            "come-default",
            "anySeven-default"
          ];

          mappedBetIds.forEach( id => {
            if (winningIds.includes(id)) {
              this._pushIfNotEmpty(result.winners, mappedBets[id]);
            }
            else {
              markBetLoser(id);
            }
          });
        }
      }
    }

    // analyze number result for specific bets

    // Hard ways
    if (HARD_WAYS.includes(rollFrame.roll.total)) {
      let hardId = `hardWay-${rollFrame.roll.total}-default`;

      // if the bet isn't already determined to be a loser
      if (!removedBetIds.includes(hardId)) {
        if (crapsMeta.hardWay) {
          this._pushIfNotEmpty(result.winners, mappedBets[`hardWay-${rollFrame.roll.total}-default`]);
        }
        else {
          markBetLoser(`hardWay-${rollFrame.roll.total}-default`);
        }
      }
    }

    // check field bet, either wins or loses each roll
    const fieldBetId = 'field-default';
    // don't bother checking if it's already lost
    if (!removedBetIds.includes(fieldBetId)) {
      if (FIELD_VALUES.includes(rollFrame.roll.total)) {
        this._pushIfNotEmpty(result.winners, mappedBets[fieldBetId]);
      }
      else {
        markBetLoser(fieldBetId);
      }
    }

    // create updatedBets


    return result;
  }

}

export default BetHelper;
