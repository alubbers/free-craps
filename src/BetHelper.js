import { makeAutoObservable } from "mobx";
import {HARD_WAYS, ANY_CRAPS, C_AND_E, FIELD_VALUES} from './CrapsTableStore';

class BetHelper {

  // the 'n' denotes a BigInt so players can have crazy large bets
  startingBank = 0n;

  bank = 0n;

  bets = [];

  constructor(startingBank = 500n) {
    this.startingBank = startingBank;
    this.bank = startingBank;
    makeAutoObservable(this);
  }

  reset() {
    this.bets = [];
    this.bank = this.startingBank;
  }

  getBets() {
    return this.bets;
  }

  getBetsForBucket(bucketCode) {
	  return this.bets.filter( b => b.bucketCode === bucketCode );
  }

 /**
  * make a new bet or change an existing one
  * The type param specifies things like "odds", "lay", "come bet odds",
  * or other notations of the bet type within a bucket
  */
  makeBet(amount, bucketCode, type = "default") {
    let bankDelta = 0n;

    let existingBet = this.bets.find( b => b.bucketCode === bucketCode && b.type === type );

    if (existingBet === undefined) {
      // make a new bet
      bankDelta = amount;

      this.bets.push({
        amount: amount,
        bucketCode: bucketCode,
        type: type
      });
    }
    else {
      // change the value of the existing bet and find the change in the bank value
      bankDelta = amount - existingBet.amount;

      existingBet.amount = amount;
    }

    this.bank = this.bank - bankDelta;
  }

  clearBet(bucketCode) {
    this.bets = this.bets.filter( b => b.bucketCode !== bucketCode );
  }

  /**
   * Utility method to capture as JSON since BigInts are not compatible with JSON.stringify
   */
  asJson() {

    let resultObj = {
      startingBank: this.startingBank.toString(),
      bank: this.bank.toString(),
      bets: this.betsAsJsonFriendly()
    };

    return JSON.stringify(resultObj);
  }

  betsAsJsonFriendly(betsToFormat = this.bets) {
    return betsToFormat.map((b) => {
       let temp = { ...b, amount: "" };
       if (b.amount) {
         temp.amount = b.amount.toString();
       }

       return temp;
      });
  }

  pushIfNotEmpty(array, element) {
    if (element) {
      array.push(element);
    }
  }

  /**
   * Build a map with details on the betting results of the given roll.
   *
   * @param rollFrame a map of 3 properties:
   *   roll:  The roll result from RollUtils
   *   crapsMeta:  The metadata about the roll result
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

      this.pushIfNotEmpty(removedBetIds, bet ? bet.id : undefined);
      this.pushIfNotEmpty(result.losers, bet);
    };

    const passLineBet = mappedBets["pass-default"];
    const dontPassBet = mappedBets["dontPass-default"];
    if (crapsMeta.craps) {
      markBetLoser("pass-default");

      // Traditionally, a don't pass bet on a 12 is a 'push' , i.e. a tie, so it doesn't win or lose
      if (rollFrame.roll.total !== 12) {
        this.pushIfNotEmpty(result.winners, dontPassBet);
      }
    }
    else {
      if (crapsMeta.passLineWin) {
        this.pushIfNotEmpty(result.winners, passLineBet);
        this.pushIfNotEmpty(result.winners, mappedBets["come-default"]);

        markBetLoser("dontPass-default");
        markBetLoser("dontCome-default");
      }
      else {
        if (crapsMeta.pointState === "POINT_HIT") {
          this.pushIfNotEmpty(result.winners, passLineBet);

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
              this.pushIfNotEmpty(result.winners, mappedBets[id]);
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
    /*
    if (HARD_WAYS.includes(rollFrame.roll.total)) {
      if (crapsMeta.hardWay) {
        this.pushIfNotEmpty(result.winners, mappedBets[`hardWay-${roll.total}`]);
      }
      else {
        markBetLoser(`hardWay-${roll.total}`);
      }
    }
    */

    // check field bets


    // create updatedBets


    return result;
  }

}

export default BetHelper;
