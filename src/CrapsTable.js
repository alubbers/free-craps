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

  buildKeyedVariants() {

    let placeVariants = this.store.betBuckets.filter( e => e.type === 'place').map((e) => {
      let variant = "";
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

      return {
        key: `place-${e.value}`,
        variant: variant
      }

      // FIXME TODO the rest

    });

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
      return (<Button style={{fontSize: "x-large"}} variant={variant} >{e.value}</Button>);
    });

    let setTwoBuckets = [];

    // get 2 sets of 3 of the place bets
    setTwoBuckets.push(setOneBuckets.pop());
    setTwoBuckets.push(setOneBuckets.pop());
    setTwoBuckets.push(setOneBuckets.pop());
    setTwoBuckets.reverse();

    return {
      setOne: (<ButtonGroup style={{width: "100%"}}>{setOneBuckets}</ButtonGroup>),
      setTwo: (<ButtonGroup style={{width: "100%"}}>{setTwoBuckets}</ButtonGroup>)
    }
  }

  buildActiveBody() {

    const variantByKey = this.buildKeyedVariants();

    const placeBetButtonGroups = this.buildPlaceBetComponents();

    const component = <>
        <Row xs="3" className="crapsTable">
          <Col xs="7">
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

          <Col xs="5">
            <Row>
              <Col xs="12">
                <div style={{width: "1%", float: "left"}}>H A R D</div>
                <ButtonGroup vertical style={{ height: "100%"}}>
                  <Button variant="success">4</Button>
                  <Button variant="success">8</Button>
                </ButtonGroup>
                <ButtonGroup vertical style={{ height: "100%"}}>
                  <Button variant="success">6</Button>
                  <Button variant="success">10</Button>
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <ButtonGroup>
                  <Button variant="success" style={{width: "100%"}}>C&amp;E</Button>
                  <Button variant="success" style={{width: "100%"}}>7</Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="crapsTable">
          <Col xs="7">
            <Row>
              <Col>
                <Button style={{width: "100%", color: "yellow"}} variant="success">Field</Button>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <ButtonGroup style={{width: "100%"}}>
                  <Button style={{width: "100%"}} variant="success">Pass</Button>
                  <Button style={{width: "100%", color: "black"}} variant="success">No Pass</Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
          <Col xs="5">
            <div style={{width: "1%", float: "left"}}>H O R N</div>
            <ButtonGroup vertical style={{ height: "100%"}}>
              <Button variant="success">2</Button>
              <Button variant="success">11</Button>
            </ButtonGroup>
            <ButtonGroup vertical style={{ height: "100%"}}>
              <Button variant="success">3</Button>
              <Button variant="success">12</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </>;

    return component;

  }

  render() {
    return <IdlingComponent active={true} activeComponentBuilder={() => this.buildActiveBody()} />;
  }
}

export default CrapsTable;
