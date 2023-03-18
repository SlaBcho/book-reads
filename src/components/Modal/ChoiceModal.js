import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ChoiceModal = ({ show, handleClose, onRemoveFromFavourite }) => {

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Внимание</Modal.Title>
        </Modal.Header>
        <Modal.Body>Сигурен ли сте, че искате да изтриите?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отказ
          </Button>
          <Button variant="primary" onClick={onRemoveFromFavourite}>
            Изтрий
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChoiceModal;