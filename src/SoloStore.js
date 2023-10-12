import { makeAutoObservable } from "mobx"

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
      rollCount: 0
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

    const alphaDie = Math.ceil(Math.random() * 6);
    const betaDie = Math.ceil(Math.random() * 6);
    const rollTotal = alphaDie + betaDie;

    const bets = [];

    // FIXME TODO Still need to handle the point, probably need to do this in a util somewhere
    this.currentGame.rolls.push({
      roll: {
        a: alphaDie,
        b: betaDie,
        total: rollTotal
      },
      activeBets: bets
    });

    this.currentGame.rollCount++;

    this.ready = true;
  }

}

export default new SoloStore();
