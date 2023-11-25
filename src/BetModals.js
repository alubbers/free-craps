import React, {useState} from "react";
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

  const [amount, setAmount] = useState(1);

  const [initialized, setInitialized] = useState(1);

  let existingBet = 0n;

  let betLabel = "N/A";

  const bucket = crapsTableStore.getBucketForCode(props.bucketCode);

  if (bucket) {
    betLabel = bucket.label;

    if (bucket.type === "hard") {
      betLabel = "Hard " + betLabel;
    }

    const betsForBucket = props.bets.getBetsForBucket(props.bucketCode);

    // TODO find the default bucket for now
    if (betsForBucket) {
      const defaultBet = betsForBucket.find(b => b.type === "default");
      if (defaultBet) {
        existingBet = defaultBet.amount;
      }
    }
  }

  if (!initialized) {
    setAmount("" + existingBet);
    setInitialized(true);
  }

  const clearOnclick = (event) => {
    props.saveCallback("0");
    props.hideCallback();
  }

  const saveOnclick = (event) => {
    const inputValue = document.getElementById("makeBetValue").value;
    props.saveCallback(inputValue);
    props.hideCallback();
  }

  const updateMakeBetValue = () => {
    const inputValue = document.getElementById("makeBetValue").value;
    setAmount(inputValue);
  }

  const modalCloseCleanup = (followUpFunc) => {
    setInitialized(false);
    followUpFunc();
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
            <Form.Control id="makeBetValue" type="text" value={amount} onChange={() => updateMakeBetValue(setAmount)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={(event) => modalCloseCleanup(props.hideCallback)}>Cancel</Button>
          <Button variant="danger" onClick={(event) => modalCloseCleanup(clearOnclick)}>Clear</Button>
          <Button variant="success" onClick={(event) => modalCloseCleanup(saveOnclick)}>Bet!</Button>
        </Modal.Footer>
    </Modal>
  );
};
