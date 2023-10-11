import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { Component } from 'react';
import ProfileStore from './ProfileStore';

import logo from './logo.svg';
import './App.css';

class Profile extends Component {

  constructor() {
    super();
    this.store = ProfileStore;
  }

  doClick() {
    alert('Woo hoo!');
  }

  render() {

    let i = 0;
    let profileDataElements = ['name', 'handle', 'cash', 'created'].map( key => {
      return <Row><Col className="profileLabel">{key}</Col><Col className="profileValue">{this.store.data[key]}</Col></Row>;
    });

    return (
      <div className="App">
        <header className="App-header">
          <p><h1>Craps</h1></p>
          <p><h2>Profile</h2></p>
        </header>
        <body>
          <Container>
              {profileDataElements}
          </Container>

        </body>
      </div>
    );
  }

}

export default Profile;
