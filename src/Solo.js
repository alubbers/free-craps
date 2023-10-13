import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';
import IdlingComponent from './IdlingComponent';
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
      const rollRows = this.props.currentGame.rolls.map( (e, index) => {
        return <ListGroup.Item key={index} variant="success">You rolled a {e.roll.a} and a {e.roll.b} for a total of {e.roll.total}</ListGroup.Item>;
      });

      currentActivity = (
        <>
          <h3>Current Game</h3>
          <p>Started on {this.props.currentGame.when}</p>

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
          <Row>
            <Col>
              <ListGroup>
                {rollRows}
              </ListGroup>
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