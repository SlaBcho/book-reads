import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from '../../hooks/useForm';

import * as profileService from '../../services/profileService';
import { ProfileContext } from '../../context/ProfileContext';
import { useContext } from 'react';
import { useErrors } from '../../hooks/useErrors';

const CreateFormModal = ({ user, show, handleClose, onSetProfile }) => {
    const { allProfiles } = useContext(ProfileContext);
    const { errorMessage, onErrorHandler } = useErrors();
    const [errors, setErrors] = useState({});

    const { formValues, onChangeHandler, changeValues } = useForm({
        username: '',
        name: '',
        email: user.email,
        dateOfBirth: '',
    });

    const onBlurHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let error = null;
        
        switch (name) {
            case 'username':
                if (allProfiles !== undefined && allProfiles.find(el => el.username === value && el._ownerId !== user._id)) {
                    error = 'This username already exist!';
                }
                break;
            case 'dateOfBirth':
                if (Number(value.slice(0, 4)) >= 2023 || Number(value.slice(0, 4)) <= 1900) {
                    error = 'Invalid date of Birth!';
                } 
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onSetProfileSubmit = (e) => {
        e.preventDefault();

        profileService.setMyProfile(formValues)
            .then(res => {
                onSetProfile(res);
            })
            .catch((err) => {
                onErrorHandler(err.message);
            });
        handleClose();
    };

    const onHandleClose = () => {
        changeValues({
            username: '',
            name: '',
            email: user.email,
            dateOfBirth: '',
        });
        handleClose();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Пвсевдоним</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Johniee"
                                value={formValues.username}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
                            />
                            {errors.username && <span style={{ color: 'red' }}>{errors.username} </span>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Име</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formValues.name}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
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
                                min="01-01-1990"
                                max="01-01-2023"
                                placeholder="01/01/1990"
                                value={formValues.dateOfBirth}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
                            />
                            {errors.dateOfBirth && <span style={{ color: 'red' }}>{errors.dateOfBirth} </span>}

                        </Form.Group>
                        {errorMessage && <span style={{ color: 'red' }}>{errorMessage} </span>}
                        <Button className="me-4" onClick={onSetProfileSubmit} variant="primary" type="submit"  disabled={errors.username || errors.dateOfBirth}>
                            Потвърди
                        </Button>
                        <Button onClick={onHandleClose} variant="primary" >
                            Откажи
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
};

export default CreateFormModal;