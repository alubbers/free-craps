import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { Component } from "react";
import IdlingComponent from "./IdlingComponent";
import CrapsTable from "./CrapsTable";
import CrapsTableStore from "./CrapsTableStore";
import { RollTicker } from "./RollTicker";
import { BetsModal, MakeBetModal } from "./BetModals";
import { observer } from "mobx-react";

import "./App.css";

const Solo = observer(({ store }) => {
  const betsModal = {
    show: store.betsModalShowing,
    bets: store.betTracker.getBets(),
  };

  let makeBetModal = {
    show: store.makeBetModalBucket !== undefined,
    bucket: store.makeBetModalBucket,
    value: "0",
  };

  if (store.makeBetModalValue !== undefined) {
    makeBetModal.value = store.makeBetModalValue;
  }

  return (
    <SoloView
      soloStore={store}
      betsModal={betsModal}
      makeBetModal={makeBetModal}
      gameStarted={store.gameStarted}
      storeReady={store.ready}
      currentGame={store.currentGame}
      betTracker={store.betTracker}
    />
  );
});

class SoloView extends Component {
  componentDidMount() {
    this.store = this.props.soloStore;
    this.crapsTableStore = new CrapsTableStore();
  }

  rollDice() {
    this.store.doRoll();
  }

  startNewGame() {
    this.store.startNewGame();
  }

  showBetsModal() {
    this.store.showBetsModal();
  }

  hideBetsModal() {
    this.store.hideBetsModal();
  }

  betBucketClicked(bucket) {
    this.store.showMakeBetModal(bucket);
  }

  hideMakeBetModal() {
    this.store.hideMakeBetModal();
  }

  updateMakeBetValue(newValue) {
    this.store.updateMakeBetValue(newValue);
  }

  makeBet() {
    // sanity check the value
    if (!this.store.makeBetModalValue) {
      // if no value was defined, assume it was meant to be 0
      this.updateMakeBetValue(0n);
    }

    this.store.betMade();
  }

  buildActiveBody() {
    const newGame = (
      <Button variant="primary" onClick={() => this.startNewGame()}>
        New
      </Button>
    );

    let currentActivity = <div>{newGame}</div>;

    if (this.props.gameStarted) {
      const startedDate = this.props.currentGame.when;
      const startedDisplay = `${startedDate.getMonth() + 1}/${startedDate.getDate()}/${startedDate.getFullYear()}`;

      currentActivity = (
        <>
          <Row>
            <Col>
              <Button variant="primary" onClick={() => this.rollDice()}>
                Roll
              </Button>
            </Col>
            <Col>
              <Button variant="primary" onClick={() => this.showBetsModal()}>
                Bets
              </Button>
            </Col>
            <Col>{newGame}</Col>
          </Row>
          <BetsModal
            show={this.props.betsModal.show}
            hideCallback={() => this.hideBetsModal()}
            bets={this.props.betsModal.bets}
          />
          <MakeBetModal
            show={this.props.makeBetModal.show}
            hideCallback={() => this.hideMakeBetModal()}
            saveCallback={() => this.makeBet()}
            updateCallback={(amount) => this.updateMakeBetValue(amount)}
            modalState={this.props.makeBetModal}
          />
          <CrapsTable
            bucketClick={(code) => this.betBucketClicked(code)}
            currentGame={this.props.currentGame}
            oddsEnabled={this.store.getOddsEnabled()}
            betTracker={this.props.betTracker}
          />
          <div>
            <span>Cash: ${this.props.betTracker.bank.toString()}</span>
          </div>
          <Row>
            <Col>
              <RollTicker rolls={this.props.currentGame.rolls} />
            </Col>
          </Row>
        </>
      );
    }

    return currentActivity;
  }

  render() {
    return (
      <div className="App">
        <div>Single Player</div>
        <div>
          <IdlingComponent
            active={this.props.storeReady}
            activeComponentBuilder={() => this.buildActiveBody()}
          />
        </div>
      </div>
    );
  }
}

export default Solo;
