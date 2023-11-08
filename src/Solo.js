import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';
import IdlingComponent from './IdlingComponent';
import CrapsTable from './CrapsTable';
import ListGroup from 'react-bootstrap/ListGroup';
import { observer } from "mobx-react"

import './App.css';

const Solo = observer(({ store }) =>
  <SoloView soloStore={store}
            gameStarted={store.gameStarted}
            storeReady={store.ready}
            currentGame={store.currentGame} />);

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

  buildActiveBody() {
    const newGame = <Button variant="primary" onClick={() => this.startNewGame()}>Start New Game</Button>;

    let currentActivity;

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

      currentActivity = (
        <>
          <Row>
            <Col>
              <Button variant="primary" onClick={() => this.rollDice()}>Roll Dice</Button>
            </Col>
            <Col>
              {newGame}
            </Col>
          </Row>
          <CrapsTable currentGame={this.props.currentGame}/>
          <Row>
            <Col>
              {rollRows}
            </Col>
          </Row>
        </>
      );
    }
    else {
      currentActivity = <div>{newGame}</div>;
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
