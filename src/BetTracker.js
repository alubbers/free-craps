import { makeAutoObservable } from "mobx";

import BetHelper from './BetHelper';

class BetTracker {
  // the 'n' denotes a BigInt so players can have crazy large bets
  startingBank = 0n;

  bank = 0n;

  bets = [];

  betHelper = new BetHelper();

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

  getBetsForGroup(groupCode) {
    return this.bets.filter( b => b.groupCode === groupCode );
  }

 /**
  * make a new bet or change an existing one
  * The option param specifies things like "odds", "lay", "come bet odds",
  * or other notations of the bet option within a bucket
  */
  makeBet(amount, groupCode, option = "default") {
    let bankDelta = 0n;

    let existingBet = this.bets.find( b => b.groupCode === groupCode && b.option === option );

    if (existingBet === undefined) {
      // make a new bet
      bankDelta = amount;

      this.bets.push({
        amount: amount,
        groupCode: groupCode,
        option: option,
        bucketCode: `${groupCode}-${option}`
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
   * Add an amount to the bank total, typically winnings from some bet(s)
   */
  bankDeposit(amount) {
    this.bank += amount;
  }

  /**
   * A bulk operation to replace all existing bets with the incoming set.
   * Usually used to replace bets after a roll to account for lost bets.
   */
  replaceBets(newBets) {
    const removedBets = this.bets.filter( b => !newBets.some( newBet => b.bucketCode === newBet.bucketCode));

    removedBets.forEach( removed => this.clearBet(removed.bucketCode));

    newBets.forEach( newBet => this.makeBet(newBet.amount, newBet.groupCode, newBet.option));
  }

  /**
   * Utility method to capture as JSON since BigInts are not compatible with JSON.stringify
   */
  asJson() {

    let resultObj = {
      startingBank: this.startingBank.toString(),
      bank: this.bank.toString(),
      bets: this.betHelper.betsAsJsonFriendly()
    };

    return JSON.stringify(resultObj);
  }

}

export default BetTracker;
