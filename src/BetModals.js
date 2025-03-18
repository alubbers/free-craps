import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {CrapsTableStore} from './CrapsTableStore';
import PropTypes from 'prop-types';

const crapsTableStore = new CrapsTableStore();

export const BetsModal = props => {

  let betSummary = <span>You have no bets</span>;

  let filteredZeros = undefined;
  if (props.bets) {
    filteredZeros = props.bets.filter( (bet) => { return bet.amount !== 0n });
  }

  if (filteredZeros && filteredZeros.length > 0) {
    let betTotal = 0n;
    let betList = filteredZeros.map( (bet) => {
      betTotal = betTotal + bet.amount;
      return (
        <li key={bet.bucketCode}>
          ${bet.amount.toString()} on {crapsTableStore.getVerboseLabelForCode(bet.bucketCode)}
        </li>
        );
    });
    betSummary = (
      <div>
        <ul>{betList}</ul>
        <span>{`Total: $${betTotal}`}</span>
      </div>
    );
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

BetsModal.propTypes = {
  bets: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  hideCallback: PropTypes.func
};

export const MakeBetModal = props => {

  const betLabel = props.modalState.bucket?.verboseLabel ?? "";

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
            <Form.Control id="makeBetValue" type="number" min="0" value={props.modalState.value} onChange={(event) => updateMakeBetValue(event)}/>
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

MakeBetModal.propTypes = {
  modalState: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  updateCallback: PropTypes.func.isRequired,
  saveCallback: PropTypes.func.isRequired,
  hideCallback: PropTypes.func
};
