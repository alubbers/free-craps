import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';
import IdlingComponent from './IdlingComponent';
import CrapsTable from './CrapsTable';
import CrapsTableStore from './CrapsTableStore';
import { BetsModal, MakeBetModal } from './BetModals';
import { observer } from "mobx-react"

import './App.css';

const Solo = observer(({ store }) => {
	const betsModal = {
	  show: store.betsModalShowing,
		bets: store.betTracker.getBets()
	};

	let makeBetModal = {
	  show: store.makeBetModalBucket !== undefined,
		bucket: store.makeBetModalBucket,
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
					betTracker={store.betTracker} />
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
    const newGame = <Button variant="primary" onClick={() => this.startNewGame()}>New</Button>;

    let currentActivity = <div>{newGame}</div>;

    if (this.props.gameStarted) {
      let rollElementList = [].concat(this.props.currentGame.rolls);
      rollElementList.reverse();

      const rollRows = rollElementList.map( (e, index) => {
        let details = [];

				// build results on bets
				e.betResult.winners.forEach((item, i) => {
					details.push(<Alert key={`winner-${i}`} variant="success">Bet of ${item.amount.toString()} on {this.crapsTableStore?.getVerboseLabelForCode(item.bucketCode)} wins!!</Alert>);
				});

				e.betResult.losers.forEach((item, i) => {
					details.push(<Alert key={`loser-${i}`} variant="danger">Bet of ${item.amount.toString()} on {this.crapsTableStore?.getVerboseLabelForCode(item.bucketCode)} loses ...</Alert>);
				});

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
							details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="danger"><strong>Seven Line Away ...</strong></Alert>);
            }
          }

          if (e.crapsMeta.hardWay) {
            details.push(<Alert key={`roll-${index}-detail-${details.length}`} variant="secondary">Roll is a hard way!</Alert>);
          }
        }

        return <>
						<Row>
							<Col xs="5">
								<hr/>
							</Col>
							<Col xs="2" style={{padding: "0px"}}>
								Roll {rollElementList.length - (index)}
							</Col>
							<Col xs="5">
								<hr/>
							</Col>
						</Row>
            <Alert key={`roll-${index}-basic`} variant="dark">You rolled a {e.roll.a} and a {e.roll.b} for a total of {e.roll.total}</Alert>
            {details}
          </>;
      });

      const startedDate = this.props.currentGame.when;
      const startedDisplay = `${startedDate.getMonth() + 1}/${startedDate.getDate()}/${startedDate.getFullYear()}`;

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
						<span>Cash: ${this.props.betTracker.bank.toString()}</span>
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
