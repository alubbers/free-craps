import { makeAutoObservable } from "mobx";

import RollUtils from "./RollUtils";

class SoloStore {

  currentGame = {};

  gameStarted = false;

  games = [];

  ready = true;

  constructor() {
    makeAutoObservable(this);
  }

  unreadyTest() {
    this.ready = false;
  }

  readyTest() {
    this.ready = true;
  }

  startNewGame() {
    this.ready = false;

    if (!this.games) {
      this.games = [];
    }

    this.currentGame = {
      when: "10/11/2023 " + new Date().getTime() % 100,
      rolls: [],
      rollCount: 0,
      point: 0
    };

    this.games.push(this.currentGame);

    this.gameStarted = true;

    this.ready = true;
  }

  doRoll() {
    this.ready = false;

    // don't roll if there is no game started
    if (!this.currentGame) {
      throw "Cannot perform a roll when a game isn't started";
    }

    const bets = [];
    const rollResult = RollUtils.roll2d6();
    const crapsResult = RollUtils.buildCrapsResult(rollResult, this.currentGame.point);

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

}

export default new SoloStore();
