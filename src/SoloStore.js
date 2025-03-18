import { makeAutoObservable } from "mobx";

import { RollUtils } from "./RollUtils";

import BetTracker from "./BetTracker";
import BetHelper from "./BetHelper";

const rollUtils = new RollUtils();

const betHelper = new BetHelper();

class SoloStore {

  currentGame = {};

  gameStarted = false;

  games = [];

  lastBetResult = {};

  ready = true;

  betTracker = new BetTracker();

  betsModalShowing = false;

  makeBetModalBucket = undefined;

  makeBetModalValue = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  startNewGame() {
    this.ready = false;

    if (!this.games) {
      this.games = [];
    }

    this.currentGame = {
      when: new Date(),
      rolls: [],
      rollCount: 0,
      point: 0
    };

    this.betTracker.reset();

    this.games.push(this.currentGame);

    this.gameStarted = true;

    this.ready = true;
  }

  doRoll() {
    this.ready = false;

    // don't roll if there is no game started
    if (!this.currentGame) {
      throw new Error("Cannot perform a roll when a game isn't started");
    }

    const bets = this.betTracker.getBets();
    const rollResult = rollUtils.roll2d6();
    const crapsResult = rollUtils.buildCrapsResult(rollResult, this.currentGame.point);

    let rollFrame = {
      roll: rollResult,
      crapsMeta: crapsResult,
      activeBets: bets
    };

    this.lastBetResult = betHelper.handleBetsForRoll(rollFrame);

    // update bets and bank total
    let payoutTotal = 0n;
    this.lastBetResult.payouts.forEach(payout => payoutTotal += payout.amount);

    this.betTracker.bankDeposit(payoutTotal);

    this.betTracker.replaceBets(this.lastBetResult.updatedBets);

    rollFrame.betResult = this.lastBetResult;

    this.currentGame.rolls.push(rollFrame);

    if (crapsResult.newPoint !== -1) {
      this.currentGame.point = crapsResult.newPoint;
    }

    this.currentGame.rollCount++;

    this.ready = true;
  }

  betMade() {
    this.ready = false;

    this.betTracker.makeBet(BigInt(this.makeBetModalValue), this.makeBetModalBucket.groupCode, this.makeBetModalBucket.option);

    this.ready = true;
  }

  showBetsModal() {
    this.betsModalShowing = true;
  }

  hideBetsModal() {
    this.betsModalShowing = false;
  }

  showMakeBetModal(bucket) {
	  this.ready = false;

    if (bucket === undefined) {
      console.warn("Attempting to show the make bet modal with an undefined bucket is a no-op");
    }

    const betsForBucket = this.betTracker.getBetsForGroup(bucket.groupCode);

    const betToCheck = betsForBucket.find((bet) => bet.groupCode === bucket.groupCode && bet.option === bucket.option);

    this.makeBetModalBucket = bucket;

    if (betToCheck) {
      this.makeBetModalValue = betToCheck.amount.toString();
    }

    this.ready = true;
  }

  hideMakeBetModal() {
    this.ready = false;

    this.makeBetModalBucket = undefined;
    this.makeBetModalValue = undefined;

    this.ready = true;
  }

  updateMakeBetValue(newValue) {
    this.makeBetModalValue = newValue;
  }

}

const singleton = new SoloStore();
export default singleton;
