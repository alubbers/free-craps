import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';

import IdlingComponent from './IdlingComponent';
import {HARD_WAYS, ANY_CRAPS, C_AND_E, FIELD_VALUES, CrapsTableStore} from './CrapsTableStore';
import {POINT_STATES, RollUtils} from './RollUtils';

import logo from './logo.svg';
import './App.css';


class CrapsTable extends Component {

  constructor() {
    super();
    this.store = new CrapsTableStore();
  }

  buildMappedVariants() {

    let results = this.store.betBuckets.map((e) => {return { key: e.code, variant: "success"};});

    if (this.props.currentGame && this.props.currentGame.rolls.length >= 1) {
      const lastRoll = this.props.currentGame.rolls.slice(-1)[0];

      const lastTotal = lastRoll.roll.total;

      results = this.store.betBuckets.map((e) => {
        let variant = "success";

        if (e.type === 'place') {
          if (lastTotal + '' === e.label) {
            if (lastRoll.crapsMeta.pointState === "POINT_SET") {
              variant = "outline-dark";
            }
            else if (lastRoll.crapsMeta.pointState === "POINT_HIT") {
              variant = "outline-success";
            }
            else {
              variant = "outline-primary";
            }
          }
          else if (this.props.currentGame.point + '' === e.label) {
            variant = "dark";
          }
        }
        else if (e.type === 'pass') {
          if (e.code === 'dontPass') {
            if (lastRoll.crapsMeta.craps) {
              variant = "outline-primary";

              // Don't pass pushes on 12 when point isn't set
              if (lastTotal === 12) {
                variant = "outline-secondary";
              }
            }

            if (lastRoll.crapsMeta.pointState === POINT_STATES.lineAway) {
              variant = "outline-primary";
            }
          }

          if (e.code === 'pass') {
            if (lastRoll.crapsMeta.passLineWin) {
              variant = "outline-primary";
            }

            if (lastRoll.crapsMeta.pointState === POINT_STATES.pointHit) {
              variant = "outline-primary";
            }
          }
        }
        else if (e.type === 'hardWay') {
          if (lastTotal + '' === e.label) {
            if (lastRoll.crapsMeta.hardWay) {
              variant = "outline-primary";
            }
            else {
              variant = "outline-danger";
            }
          }
        }
        else if (e.type === 'horn') {
          if (lastTotal + '' === e.label) {
            variant = "outline-primary";
          }
        }
        else if (e.type === 'anySeven') {
          if (lastTotal === 7) {
            variant = "outline-primary";
          }
        }
        else if (e.type === 'anyCraps') {
          if (ANY_CRAPS.includes(lastTotal)) {
            variant = "outline-primary";
          }
        }
        else if (e.type === 'c-and-e') {
          if (C_AND_E.includes(lastTotal)) {
            variant = "outline-primary";
          }
        }
        else if (e.type === 'field') {
          if (FIELD_VALUES.includes(lastTotal)) {
            variant = "outline-primary";
          }
        }

        return {
          key: e.code,
          variant: variant
        };
      });
    }

    let mappedVariants = {};

    results.forEach(e => mappedVariants[e.key] = e.variant);

    return mappedVariants;
  }
  
  getBucketClickFunction() {
    let result = (code) => {};
    if (this.props.bucketClick) {
      result = (code) => this.props.bucketClick(code);
    }
    
    return result;
  }

  buildPlaceBetComponents(mappedVariants) {

    const bucketClickFunction = this.getBucketClickFunction();

    let setOneBuckets = this.store.betBuckets.filter( e => e.type === 'place').map((e) => {
      return (
        <Button key={e.code}
          onClick={() => bucketClickFunction(e.code)}
          style={{fontSize: "x-large"}}
          variant={mappedVariants[e.code]}>
          {e.label}
        </Button>
      );
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
  
  buildHardWayComponentMap(mappedVariants) {
    
    const bucketClickFunction = this.getBucketClickFunction();
    let componentMap = {};
    
    HARD_WAYS.forEach((hardWayNum) => {
      const code = `hardWay-${hardWayNum}`;
      const bucket = this.store.getBucketForCode(code);
      
      
      let result = <></>;
      
      if (bucket) {
        result = ( <Button key={code} onClick={() => bucketClickFunction(code)} variant={mappedVariants[code]}>
              {bucket.label}
            </Button>
            );
      }
      
      componentMap[code] = result;
    });
    
    
    return componentMap;
  }

  buildActiveBody() {

    let mappedVariants = this.buildMappedVariants();

    const placeBetButtonGroups = this.buildPlaceBetComponents(mappedVariants);
    
    const hardWayComponents = this.buildHardWayComponentMap(mappedVariants);

    let fieldTextColor = "yellow";
    if (mappedVariants["field"] === "outline-primary") {
      fieldTextColor = "#cccc00";
    }

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
                  {hardWayComponents["hardWay-4"]}
                  {hardWayComponents["hardWay-8"]}
                </ButtonGroup>
                <ButtonGroup vertical style={{ height: "100%"}}>
                  {hardWayComponents["hardWay-6"]}
                  {hardWayComponents["hardWay-10"]}
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <ButtonGroup>
                  <Button variant={mappedVariants["c-and-e"]} style={{width: "100%"}}>C&amp;E</Button>
                  <Button variant={mappedVariants["anySeven"]} style={{width: "100%"}}>7</Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="crapsTable">
          <Col xs="7">
            <Row>
              <Col>
                <Button style={{width: "100%", color: "#cccc00"}} variant={mappedVariants["field"]}>Field</Button>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <ButtonGroup style={{width: "100%"}}>
                  <Button style={{width: "100%"}} variant={mappedVariants["pass"]}>Pass</Button>
                  <Button style={{width: "100%", color: "black"}} variant={mappedVariants["dontPass"]}>No Pass</Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
          <Col xs="5">
            <div style={{width: "1%", float: "left"}}>H O R N</div>
            <ButtonGroup vertical style={{ height: "100%"}}>
              <Button variant={mappedVariants["horn-2"]}>2</Button>
              <Button variant={mappedVariants["horn-11"]}>11</Button>
            </ButtonGroup>
            <ButtonGroup vertical style={{ height: "100%"}}>
              <Button variant={mappedVariants["horn-3"]}>3</Button>
              <Button variant={mappedVariants["horn-12"]}>12</Button>
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
