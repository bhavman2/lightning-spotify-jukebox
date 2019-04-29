import React from 'react';
import { Modal } from 'react-bootstrap';
var QRCode = require('qrcode.react');

const InvoiceModal = (props) => {
  return (
    <Modal
      show={props.showQr}
      onHide={props.closeQr}>
      <Modal.Header closeButton>
        <Modal.Title>Lightning Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="qr-ctn">
          <QRCode
            size={200}
            value={props.invoice} />
        </div>
      </Modal.Body>
    </Modal>
  );

}
export default InvoiceModal;