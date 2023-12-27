import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';
import IdlingComponent from './IdlingComponent';
import CrapsTable from './CrapsTable';
import { BetsModal, MakeBetModal } from './BetModals';
import { observer } from "mobx-react"

import './App.css';

const Solo = observer(({ store }) => { 
	const betsModal = {
	  show: store.betsModalShowing,
    bets: store.betHelper.getBets()
	};
	
	let makeBetModal = {
	  show: store.makeBetModalBucketCode !== undefined,
	  code: store.makeBetModalBucketCode,
	  value: "0"
	};
  
	if (store.makeBetModalValue !== undefined) {
	  makeBetModal.value = store.makeBetModalValue;
	}
	
	return (
	  <SoloView soloStore={store}
            betsModal={betsModal}
            makeBetModal={makeBetModal}
            gameStarted={store.gameStarted}
            storeReady={store.ready}
            currentGame={store.currentGame}
            betHelper={store.betHelper} />
	);
  });

class SoloView extends Component {

  componentDidMount() {
    this.store = this.props.soloStore;
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

  betBucketClicked(code) {
    this.store.showMakeBetModal(code);
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
    const newGame = <Button variant="primary" onClick={() => this.startNewGame()}>New</Button>;

    let currentActivity = <div>{newGame}</div>;

    if (this.props.gameStarted) {
      let rollElementList = [].concat(this.props.currentGame.rolls);
      rollElementList.reverse();

      const rollRows = rollElementList.map( (e, index) => {
        let details = [];

        if (e.crapsMeta.craps) {
          details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="danger">Craps! Pass Line loses</Alert>);
        }
        else {
          if (e.crapsMeta.passLineWin) {
            details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="info">Pass Line Winner!</Alert>);
          }
          else {
            if (e.crapsMeta.pointState === "POINT_SET") {
              details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="primary">New Point Set</Alert>);
            }

            if (e.crapsMeta.pointState === "POINT_HIT") {
              details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="success">Point Hit!! Pass Line Winner!!</Alert>);
            }

            if (e.crapsMeta.pointState === "LINE_AWAY") {
              details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="danger">Seven Line Away ...</Alert>);
            }
          }

          if (e.crapsMeta.hardWay) {
            details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="secondary">Roll is a hard way!</Alert>);
          }
        }

        return <>
            <Alert key={`roll-${index}-basic`} variant="dark">You rolled a {e.roll.a} and a {e.roll.b} for a total of {e.roll.total}</Alert>
            {details}
            <div>&nbsp;</div>
          </>;
      });

      const startedDate = this.props.currentGame.when;
      const startedDisplay = `${startedDate.getMonth() + 1}/${startedDate.getDate()}/${startedDate.getFullYear()}`;

      let existingBets = undefined;
      if (this.props.makeBetModal.show) {
        const betsForBucket = this.props.betHelper.getBetsForBucket(this.props.makeBetModal.code);

        if (betsForBucket) {
          existingBets = {};
          betsForBucket.forEach(b => {
            existingBets[b.type] = b;
          });
        }
      }

      currentActivity = (
        <>
          <Row>
            <Col>
              <Button variant="primary" onClick={() => this.rollDice()}>Roll</Button>
            </Col>
            <Col>
              <Button variant="primary" onClick={() => this.showBetsModal()}>Bets</Button>
            </Col>
            <Col>
              {newGame}
            </Col>
          </Row>
          <BetsModal show={this.props.betsModal.show}
            hideCallback={() => this.hideBetsModal()}
            bets={this.props.betsModal.bets}/>
          <MakeBetModal show={this.props.makeBetModal.show}
            hideCallback={() => this.hideMakeBetModal()}
            saveCallback={() => this.makeBet()}
            updateCallback={(amount) => this.updateMakeBetValue(amount)}
            modalState={this.props.makeBetModal}/>
          <CrapsTable bucketClick={(code) => this.betBucketClicked(code)} currentGame={this.props.currentGame}/>
          <div>
          {JSON.stringify({
            startingBank: this.props.betHelper.startingBank.toString(),
            bank: this.props.betHelper.bank.toString(),
            bets: this.props.betHelper.bets.map( b => {
              return {
                amount: b.amount.toString(),
                bucketCode: b.bucketCode,
                type: b.type
              };
              })
          })}
          </div>
          <Row>
            <Col>
              {rollRows}
            </Col>
          </Row>
        </>
      );
    }

    return currentActivity;
  }

  render() {

    return <div className="App">
      <div>Single Player</div>
      <div>
        <IdlingComponent active={this.props.storeReady} activeComponentBuilder={() => this.buildActiveBody()} />
      </div>
    </div>;
  }

}

export default Solo;
