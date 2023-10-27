import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';

import IdlingComponent from './IdlingComponent';
import CrapsTableStore from './CrapsTableStore';

import logo from './logo.svg';
import './App.css';


class CrapsTable extends Component {

  constructor() {
    super();
    this.store = new CrapsTableStore();
  }

  buildPlaceBetComponents() {
    let setOneBuckets = this.store.betBuckets.filter( e => e.type === 'place').map((e) => {
      let variant = "success";
      if (this.props.currentGame && this.props.currentGame.rolls.length > 0) {
        const lastRoll = this.props.currentGame.rolls.toReversed()[0];
        if (lastRoll.roll.total + '' === e.value) {
          if (lastRoll.crapsMeta.pointState === "POINT_SET") {
            variant = "outline-dark";
          }
          else if (lastRoll.crapsMeta.pointState === "POINT_HIT") {
            variant = "outline-success";
          }
          else {
            variant = "outline-primary"
          }
        }
        else if (this.props.currentGame.point + '' === e.value) {
          variant = "dark";
        }
      }
      return (<Button style={{padding: "0.5em", "font-size": "xx-large"}} variant={variant} >{e.value}</Button>);
    });

    let setTwoBuckets = [];

    // get 2 sets of 3 of the place bets
    setTwoBuckets.push(setOneBuckets.pop());
    setTwoBuckets.push(setOneBuckets.pop());
    setTwoBuckets.push(setOneBuckets.pop());
    setTwoBuckets.reverse();

    return {
      setOne: (<ButtonGroup>{setOneBuckets}</ButtonGroup>),
      setTwo: (<ButtonGroup>{setTwoBuckets}</ButtonGroup>)
    }
  }

  buildActiveBody() {

    const placeBetButtonGroups = this.buildPlaceBetComponents();

    const component = <Container>
        <Row xs="3" className="crapsTable">
          <Col xs="8">
            <Row>
              <Col>
                {placeBetButtonGroups.setOne}
              </Col>
              <Col>
                {placeBetButtonGroups.setTwo}
              </Col>
            </Row>
            <Button style={{width: "100%", color: "red"}} variant="success">COME</Button>
          </Col>

          <Col xs="3">
            <ButtonGroup vertical>
              <Button variant="success">Hard  4</Button>
              <Button variant="success">Hard  8</Button>
            </ButtonGroup>
            <ButtonGroup vertical>
              <Button variant="success">Hard  6</Button>
              <Button variant="success">Hard 10</Button>
            </ButtonGroup>
          </Col>

          <Col xs="1">
            <Button variant="success" style={{height:"100%"}}>Any Seven</Button>
          </Col>
        </Row>
        <Row xs="3" className="crapsTable">
          <Col xs="8">
            <Row>
              <Col>
                <Button style={{width: "100%", color: "yellow"}} variant="success">Field</Button>
              </Col>
            </Row>
            <Row>
              <Col xs="4">
                <Button style={{width: "100%", color: "black"}} variant="success">Don't Pass</Button>
              </Col>
              <Col xs="8">
                <Button style={{width: "100%"}} variant="success">Pass Line</Button>
              </Col>
            </Row>
          </Col>
          <Col xs="3">
            <ButtonGroup vertical>
              <Button variant="success">Horn 2</Button>
              <Button variant="success">Horn 11</Button>
            </ButtonGroup>
            <ButtonGroup vertical>
              <Button variant="success">Horn  3</Button>
              <Button variant="success">Horn 12</Button>
            </ButtonGroup>
          </Col>

          <Col xs="1">
            <Button variant="success" style={{height:"100%"}}>C &amp; E</Button>
          </Col>
        </Row>
      </Container>;

    return component;

  }

  render() {
    return <IdlingComponent active={true} activeComponentBuilder={() => this.buildActiveBody()} />;
  }
}

export default CrapsTable;
