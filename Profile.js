import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';

class Profile extends Component {

  doClick() {
    alert('Woo hoo!');
  }

  render() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <h1>Craps</h1>
        </p>
      </header>
      <body>
        <Row xs={1} md={4}>
          <Col>
            <a href="/profile" className="cleanLinks">
              <Card>
                <Card.Body>
                  <Card.Title>Profile</Card.Title>
                  <Card.Text>Manage your user profile and view your betting history</Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
          <Col>
            <a href="/solo" className="cleanLinks">
              <Card>
                <Card.Body>
                <Card.Title>Single Player</Card.Title>
                <Card.Text>Play a round of craps solo</Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        </Row>
      </body>
    </div>
  );
  }

}

export default Profile;
