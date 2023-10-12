import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';
import SoloStore from './SoloStore';

import './App.css';

class IdlingComponent extends Component {

  render() {
    if (!this.props.activeComponentBuilder || !this.props.active) {
      return <Spinner animation="border" variant="success" />;
    }
    else {
      return this.props.activeComponentBuilder();
    }
  }

}

export default IdlingComponent;
