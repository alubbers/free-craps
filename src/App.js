import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';

class App extends Component {

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
            <Card>
              <Card.Body>
                <Card.Title><Button variant="primary" href="/profile">Profile</Button></Card.Title>
                <Card.Text>Manage your user profile and view your betting history</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
              <Card.Title><Button variant="primary" href="/solo">Single Player</Button></Card.Title>
              <Card.Text>Play a round of craps solo</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </body>
    </div>
  );
  }

}

export default App;
