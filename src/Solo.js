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
    const newGameCard = <Card>
      <Card.Body>
        <Card.Title><Button variant="primary" onClick={() => this.startNewGame()}>Start New Game</Button></Card.Title>
        <Card.Text>Start a New Game</Card.Text>
      </Card.Body>
    </Card>;

    let currentActivity;

    if (this.props.gameStarted) {
      const rollElementList = this.props.currentGame.rolls.toReversed();
      const rollRows = rollElementList.map( (e, index) => {
        let details = [];

        if (e.crapsMeta.craps) {
          details.push(<Alert variant="danger">Craps! Pass Line loses</Alert>);
        }
        else {
          if (e.crapsMeta.passLineWin) {
            details.push(<Alert variant="info">Pass Line Winner!</Alert>);
          }
          else {
            if (e.crapsMeta.pointState === "POINT_SET") {
              details.push(<Alert variant="primary">New Point Set</Alert>);
            }

            if (e.crapsMeta.pointState === "POINT_HIT") {
              details.push(<Alert variant="success">Point Hit!! Pass Line Winner!!</Alert>);
            }

            if (e.crapsMeta.pointState === "LINE_AWAY") {
              details.push(<Alert variant="danger">Seven Line Away ...</Alert>);
            }
          }

          if (e.crapsMeta.hardWay) {
            details.push(<Alert variant="secondary">Roll is a hard way!</Alert>);
          }
        }

        return <>
            <Alert variant="dark">You rolled a {e.roll.a} and a {e.roll.b} for a total of {e.roll.total}</Alert>
            {details}
            <div>&nbsp;</div>
          </>;
      });

      const startedDate = this.props.currentGame.when;
      const startedDisplay = `${startedDate.getMonth() + 1}/${startedDate.getDate()}/${startedDate.getFullYear()}`;

      currentActivity = (
        <>
          <h3>Current Game</h3>
          <h6>Started on {startedDisplay}</h6>
          <p>Current point: {this.props.currentGame.point === 0 ? "Off" : this.props.currentGame.point}</p>

          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title><Button variant="primary" onClick={() => this.rollDice()}>Roll Dice</Button></Card.Title>
                  <Card.Text>Roll 'em!</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              {newGameCard}
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
      currentActivity = newGameCard;
    }

    return (
      <Row xs={1}>
        <Col>{currentActivity}</Col>
      </Row>
    );
  }

  render() {

    return <div className="App">
      <header className="App-header">
        <div>
          <h1>Craps</h1>
          <h2>Single Player</h2>
        </div>
      </header>
      <div>
        <IdlingComponent active={this.props.storeReady} activeComponentBuilder={() => this.buildActiveBody()} />
      </div>
    </div>;
  }

}

export default Solo;
