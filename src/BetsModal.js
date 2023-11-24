import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BetsModal = props => {

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

export default BetsModal;
