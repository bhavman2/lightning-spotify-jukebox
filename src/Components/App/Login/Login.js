import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import './Login.css';

class Login extends Component {
  render() {
    return (
      <div className="jumbotron-ctn">
        <Jumbotron className="jumbotron">
          <h1>Welcome to the Spotify Jukebox!</h1>
          <p>
            Spotify jukebox allows your customers to play songs of their
            choice after paying a small fee on the Bitcoin Lightning Network. Launch Spotify on a device and get started below.
          </p>
          <p>
            <Button
              href="http://localhost:8888/api/login"
              variant="dark"
            >Log In With Spotify</Button>
          </p>
        </Jumbotron>
      </div>
    );
  }
}

export default Login;