import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React from 'react';
import CrapsTableStore from './CrapsTableStore';
import PropTypes from 'prop-types';

import './App.css';

export const RollTicker = props => {
  const crapsTableStore = new CrapsTableStore();

  let rollElementList = [].concat(props.rolls);
  rollElementList.reverse();

  console.log("RATOUT 0: Got " + rollElementList.length + " rolls");

  const rollRows = rollElementList.map( (e, index) => {
    let details = [];

    // build results on bets
    e.betResult.winners.forEach((item, i) => {
      details.push(<Alert key={`winner-${i}`} variant="success">Bet of ${item.amount.toString()} on {crapsTableStore?.getVerboseLabelForCode(item.bucketCode)} wins!!</Alert>);
    });

    e.betResult.losers.forEach((item, i) => {
      details.push(<Alert key={`loser-${i}`} variant="danger">Bet of ${item.amount.toString()} on {crapsTableStore?.getVerboseLabelForCode(item.bucketCode)} loses ...</Alert>);
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

  let lastRoll;

  if (rollRows && rollRows.length > 0) {
    lastRoll = rollRows.shift();
  }

  return (
    <div>
      {lastRoll}
      <Accordion>
        <Accordion.Item eventKey="pastRolls">
          <Accordion.Header>Past Rolls</Accordion.Header>
          <Accordion.Body>
            {rollRows}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );

};

RollTicker.propTypes = {
  rolls: PropTypes.array
}
