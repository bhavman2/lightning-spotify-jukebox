import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function Navigation(props) {
  return (
    <Navbar
      bg="dark"
      variant="dark">
      <Navbar.Brand>Spotify Jukebox</Navbar.Brand>
      {props.loggedIn &&
        <Nav
          className="mr-auto">
          <Nav.Link
            onClick={props.handleShowSettings}
          >Settings</Nav.Link>
          <Nav.Link
            onClick={props.logout}
          >Logout</Nav.Link>
        </Nav>}
    </Navbar>
  );
}

export default Navigation;