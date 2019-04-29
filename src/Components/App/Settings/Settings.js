import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import './Settings.css';

function Settings(props) {
  return (
    <Modal
      show={props.showSettings}
      onHide={props.handleCloseSettings}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.device.found ?
          <div
            className="modal-body">
            Listening on: {props.device.name}
          </div> :
          <div
            className="modal-body">
            No active device found! Please launch the Spotify app on a compatible device.
              <Spinner
              animation="border"
              role="status">
              <span
                className="sr-only"
              >Loading...</span>
            </Spinner>
          </div>}
      </Modal.Body>
      <Modal.Footer>
        {!props.device.found &&
          <Button
            variant="secondary"
            onClick={props.logout}>
            Logout
          </Button>}
        <Button
          variant="secondary"
          onClick={props.handleCloseSettings}>
          Close
          </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Settings;