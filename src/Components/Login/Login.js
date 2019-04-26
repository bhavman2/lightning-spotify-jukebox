import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

class Login extends Component {
  render() {
    return (
      <Jumbotron fluid>
        <h1>Welcome to the Spotify Jukebox!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <Button href="http://localhost:8888/login" variant="dark">Log In With Spotify</Button>
        </p>
      </Jumbotron>

    );
  }
}

export default Login;