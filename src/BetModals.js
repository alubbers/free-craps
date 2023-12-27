import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {CrapsTableStore} from './CrapsTableStore';

const crapsTableStore = new CrapsTableStore();

export const BetsModal = props => {

  let betSummary = <span>You have no bets</span>;

  if (props.betHelper && props.betHelper.bets.length > 0) {
    <span>You have some bets!</span>;
  }

  return (
    <Modal show={props.show} onHide={props.hideCallback}>
      <Modal.Header closeButton>
        <Modal.Title>Bets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {betSummary}
      </Modal.Body>
    </Modal>
  );
};

export const MakeBetModal = props => {

  let betLabel = "";
  
  const bucket = crapsTableStore.getBucketForCode(props.modalState.code);

  if (bucket) {
    betLabel = bucket.label;

    if (bucket.type === "hard") {
      betLabel = "Hard " + betLabel;
    }

  }

  const clearOnclick = (event) => {
    props.updateCallback("0");
    props.saveCallback();
    props.hideCallback();
  }

  const saveOnclick = (event) => {
    props.saveCallback();
    props.hideCallback();
  }

  const updateMakeBetValue = (event) => {
    props.updateCallback(event?.target?.value);
  }

  return (
    <Modal show={props.show} onHide={props.hideCallback}>
      <Modal.Header closeButton>
        <Modal.Title>Make a Bet on {betLabel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control id="makeBetValue" type="text" value={props.modalState.value} onChange={(event) => updateMakeBetValue(event)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={(event) => props.hideCallback()}>Cancel</Button>
          <Button variant="danger" onClick={(event) => clearOnclick()}>Clear</Button>
          <Button variant="success" onClick={(event) => saveOnclick()}>Bet!</Button>
        </Modal.Footer>
    </Modal>
  );
};
