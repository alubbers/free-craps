import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <h1>Craps</h1>
          </div>
        </header>
        <div>
          <Row xs={1} md={4}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title><Button variant="primary" href="/profile">Profile</Button></Card.Title>
                  <Card.Text>Manage your user profile and view your game history</Card.Text>
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
        </div>
      </div>
    );
  }

}

export default App;
