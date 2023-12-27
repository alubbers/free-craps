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

}

export default BetHelper;
