import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';

import IdlingComponent from './IdlingComponent';
import CrapsTableStore from './CrapsTableStore';
import {PASS, DONT_PASS, COME, DONT_COME, HARD_WAYS, HORN, ANY_CRAPS, C_AND_E, FIELD, ANY_SEVEN} from './CrapsConstants';
import {POINT_STATES} from './RollUtils';
import PropTypes from 'prop-types';

import './App.css';


class CrapsTable extends Component {

  constructor() {
    super();
    this.store = new CrapsTableStore();
  }

  buildMappedVariants() {

    // To build display elements, for now we only consider the 'default' option bucket
    const filteredBuckets = this.store.betBuckets.filter( e => {
      if (e.option === "default") {
        return true;
      }
      else {
        // return default and odds bets for the pass line
        return e.type === "pass" || e.type === "dontPass";
      }
    });

    let results = filteredBuckets.map((e) => {
      return { key: e.code, variant: "success"};
    });

    if (this.props.currentGame && this.props.currentGame.rolls.length >= 1) {
      const lastRoll = this.props.currentGame.rolls.slice(-1)[0];

      const lastTotal = lastRoll.roll.total;

      results = filteredBuckets.map((e) => {
        let variant = "success";

        if (e.type === 'place') {
          if (lastTotal + '' === e.label) {
            if (lastRoll.crapsMeta.pointState === POINT_STATES.pointSet) {
              variant = "outline-dark";
            }
            else if (lastRoll.crapsMeta.pointState === POINT_STATES.pointHit) {
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
        else if (e.type === 'pass' || e.type === 'dontPass') {
          if (e.type === 'dontPass') {
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

          if (e.type === 'pass') {
            if (lastRoll.crapsMeta.passLineWin) {
              variant = "outline-primary";
            }

            if (lastRoll.crapsMeta.pointState === POINT_STATES.pointHit) {
              variant = "outline-primary";
            }
          }
        }
        else if (e.type === HARD_WAYS.type) {
          if (lastTotal + '' === e.label) {
            if (lastRoll.crapsMeta.hardWay) {
              variant = "outline-primary";
            }
            else {
              variant = "outline-danger";
            }
          }
        }

        if (e.type === HORN.type && `${lastTotal}` === e.label) {
          variant = "outline-primary";
        }

        let groupedZones = [ANY_SEVEN, ANY_CRAPS, C_AND_E, FIELD]
        groupedZones.forEach(betZone => {
          if (e.type === betZone.type) {
            if (betZone.values.includes(lastTotal)) {
              variant = "outline-primary";
            }
          }
        });

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
    let result = (bucket) => {};
    if (this.props.bucketClick) {
      result = (bucket) => {
        this.props.bucketClick(bucket);
      };
    }

    return result;
  }

  buildPlaceBetComponents(mappedVariants) {

    const bucketClickFunction = this.getBucketClickFunction();

    let setOneBuckets = this.store.betBuckets.filter( e => e.type === 'place' && e.option === 'default').map((e) => {
      return (
        <Button key={e.code}
          onClick={() => bucketClickFunction(e)}
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

  buildBucketButton(mappedVariants, bucket, colSize) {
    let result = <></>;

    if (bucket) {
      const bucketClickFunction = this.getBucketClickFunction();

      let buttonText = bucket.label;
      let buttonEnabled = true;
      if (bucket.option === "odds") {
        buttonText = "Odds";

        let oddsEnabled = {
          pass: false,
          dontPass: false
        };

        if (this.props.oddsEnabled) {
          oddsEnabled = this.props.oddsEnabled;
        }

        buttonEnabled = oddsEnabled[bucket.type];
        console.log("RATOUT: buttonEnabled is " + buttonEnabled + " for bucket: " + bucket.code);
      }


      if (colSize) {
        result = ( <Button disabled={!buttonEnabled} xs={colSize} id={"bucketButton-" + bucket.code} key={bucket.code} onClick={() => bucketClickFunction(bucket)} variant={mappedVariants[bucket.code]}>
              {buttonText}
            </Button>
            );
      }
      else {
        result = ( <Button disabled={!buttonEnabled} id={"bucketButton-" + bucket.code} key={bucket.code} onClick={() => bucketClickFunction(bucket)} variant={mappedVariants[bucket.code]}>
              {buttonText}
            </Button>
            );
      }

    }

    return result;
  }

  buildHardWayComponentMap(mappedVariants) {
    let componentMap = {};

    HARD_WAYS.values.forEach((hardWayNum) => {
      const code = HARD_WAYS.codeFunc(hardWayNum);
      const bucket = this.store.getBucketForCode(code);

      componentMap[code] = this.buildBucketButton(mappedVariants, bucket);
    });

    return componentMap;
  }

  buildActiveBody() {

    let mappedVariants = this.buildMappedVariants();

    const placeBetButtonGroups = this.buildPlaceBetComponents(mappedVariants);

    const hardWayComponents = this.buildHardWayComponentMap(mappedVariants);

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
                <div style={{width: "100%"}}>
                  <div className="hardHornLabel">
                    <span>H</span>
                    <span>A</span>
                    <span>R</span>
                    <span>D</span>
                  </div>
                  <ButtonGroup vertical style={{ height: "100%"}}>
                    {hardWayComponents[HARD_WAYS.codeFunc("4")]}
                    {hardWayComponents[HARD_WAYS.codeFunc("8")]}
                  </ButtonGroup>
                  <ButtonGroup vertical style={{ height: "100%"}}>
                    {hardWayComponents[HARD_WAYS.codeFunc("6")]}
                    {hardWayComponents[HARD_WAYS.codeFunc("10")]}
                  </ButtonGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <ButtonGroup>
                  {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(C_AND_E.codeFunc()))}
                  {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(ANY_SEVEN.codeFunc()))}
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="crapsTable">
          <Col xs="7">
            <Row>
              <Col>
                <ButtonGroup style={{width: "100%"}}>
                  {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(FIELD.codeFunc()))}
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <ButtonGroup style={{width: "100%"}}>
                    {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(PASS.codeFunc()), "4")}
                    {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(PASS.codeFunc(undefined, "odds")), "2")}
                    {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(DONT_PASS.codeFunc()), "4")}
                    {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(DONT_PASS.codeFunc(undefined, "odds")), "2")}
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
          <Col xs="5">
            <div className="hardHornLabel">
              <span>H</span>
              <span>O</span>
              <span>R</span>
              <span>N</span>
            </div>
            <ButtonGroup key="hornGroup-1" vertical style={{ height: "100%"}}>
              {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(HORN.codeFunc(2)))}
              {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(HORN.codeFunc(11)))}
            </ButtonGroup>
            <ButtonGroup key="hornGroup-2" vertical style={{ height: "100%"}}>
              {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(HORN.codeFunc(3)))}
              {this.buildBucketButton(mappedVariants, this.store.getBucketForCode(HORN.codeFunc(12)))}
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

CrapsTable.propTypes = {
  currentGame: PropTypes.object.isRequired,
  bucketClick: PropTypes.func,
  oddsEnabled: PropTypes.object
}

export default CrapsTable;
