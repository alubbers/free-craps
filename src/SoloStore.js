import { makeAutoObservable } from "mobx";

import { RollUtils } from "./RollUtils";

import BetHelper from "./BetHelper";

const rollUtils = new RollUtils();

class SoloStore {

  currentGame = {};

  gameStarted = false;

  games = [];

  ready = true;

  betHelper = new BetHelper();

  betsModalShowing = false;

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

    this.betHelper.reset();

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

    const bets = this.betHelper.getBets();
    const rollResult = rollUtils.roll2d6();
    const crapsResult = rollUtils.buildCrapsResult(rollResult, this.currentGame.point);

    this.currentGame.rolls.push({
      roll: rollResult,
      crapsMeta: crapsResult,
      activeBets: bets
    });

    if (crapsResult.newPoint !== -1) {
      this.currentGame.point = crapsResult.newPoint;
    }

    this.currentGame.rollCount++;

    this.ready = true;
  }

  showBetsModal() {
    this.betsModalShowing = true;
  }

  hideBetsModal() {
    this.betsModalShowing = false;
  }

  isShowBetsModal() {
    return this.betsModalShowing;
  }

}

export default new SoloStore();
