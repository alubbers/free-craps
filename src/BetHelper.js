import { makeAutoObservable } from "mobx";

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
       return { ...b, amount: b.amount.toString() }
      });
  }
  
  /**
   * Build a map with details on the betting results of the given roll.
   * 
   * @param rollFrame a map of 3 properties:
   *   roll:  The roll result from RollUtils
   *   crapsMeta:  The metadata about the roll result
   *   activeBets: the bets in place for the roll
   */
  buildBetResults(rollFrame) {
    let result = {
      totalBankChange: 0,
      winners: [],
      losers: [],
      updatedBets: rollFrame.activeBets.map( e => { return { ...e, id: `${e.bucketCode}-${e.type}`}; } )
    };
    
    // map the bets by bucket code and type
    let mappedBets = {};
    result.updatedBets.forEach( bet => mappedBets[`${bet.bucketCode}-${bet.type}`] = bet);
    
    // let of bet ids that clear away after losing
    let removedBetIds = [];
    
    if (rollFrame.crapsMeta.craps) {
      const passLineBet = mappedBets["pass-default"];
      if (passLineBet) {
        removedBetIds.push(passLineBet.id);
        result.losers.push(passLineBet);
      }
      
      const dontPassBet = mappedBets["dontPass-default"];
      if (dontPassBet) {
        // Traditionally, a don't pass bet on a 12 is a 'push' , i.e. a tie, so it doesn't win or lose
        if (rollFrame.roll.total !== 12) {
          result.winners.push(dontPassBet);
        }
      }
    }
    else {
      if (rollFrame.crapsMeta.passLineWin) {
        const passLineBet = mappedBets["pass-default"];
        if (passLineBet) {
          result.winners.push(passLineBet);
        }
        
        const dontPassBet = mappedBets["dontPass-default"];
        if (dontPassBet) {
          removedBetIds.push(dontPassBet.id);
          result.losers.push(dontPassBet);
        }
      }
      else {
        if (rollFrame.crapsMeta.pointState === "POINT_HIT") {
          const passLineBet = mappedBets["pass-default"];
          if (passLineBet) {
            result.winners.push(passLineBet);
          }
        }

        if (rollFrame.crapsMeta.pointState === "LINE_AWAY") {
          // gather up losers
        }
      }

      if (rollFrame.crapsMeta.hardWay) {
        // FIXME
      }
    }
    
    // analyze number result for specific bets
    
    
    return result;
  }

}

export default BetHelper;
