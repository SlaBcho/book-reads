import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from '../../hooks/useForm';

const CreateFormModal = ({email, show, handleClose , onSetProfile }) => {

    const { formValues, onChangeHandler } = useForm({
        username: '',
        name: '',
        email: email,
        dateOfBirth: '',
    });

    const onSetProfileSubmit = (e) => { 
        e.preventDefault();
        onSetProfile(formValues);
        handleClose();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} onEscapeKeyDown={handleClose}>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Пвсевдоним</Form.Label>
                            <Form.Control 
                            type="text" 
                            name="username" 
                            placeholder="Johniee"
                            value={formValues.username}
                            onChange={onChangeHandler} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Име</Form.Label>
                            <Form.Control 
                            type="text" 
                            name="name" 
                            placeholder="John Doe"
                            value={formValues.name}
                            onChange={onChangeHandler}
                             />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Имейл</Form.Label>
                            <Form.Control 
                            type="text" 
                            name="email" 
                            disabled
                            value={formValues.email}
                            onChange={onChangeHandler}
                             />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicDateOFBirth">
                            <Form.Label>Рождена дата</Form.Label>
                            <Form.Control 
                            type="date" 
                            name="dateOfBirth" 
                            min="1900-01-01"
                            max="2023-040-15"
                            placeholder="01/01/1990"
                            value={formValues.dateOfBirth}
                            onChange={onChangeHandler}
                             />
                        </Form.Group>
                        <Button onClick={onSetProfileSubmit} variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
};

export default CreateFormModal;