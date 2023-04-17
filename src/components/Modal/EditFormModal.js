import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';

import * as profileService from '../../services/profileService';
import { useContext } from 'react';
import { ProfileContext } from '../../context/ProfileContext';
import { useErrors } from '../../hooks/useErrors';

const EditFormModal = ({ profileInfo, show, handleClose, onEditProfile }) => {
    const { allProfiles } = useContext(ProfileContext);
    const [profileData, setProfileData] = useState({});
    const {error, errorMessage, onErrorHandler } = useErrors();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setProfileData(profileInfo);
    }, [profileInfo]);

    const onChangeHandler = (e) => {
        setProfileData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onBlurHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let error = null;

        switch (name) {
            case 'username':
                if (allProfiles !== undefined && allProfiles.find(el => el.username === value)) {
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

        profileService.editMyProfile(profileInfo._id, profileData)
            .then(res => {
                onEditProfile(res);
            })
            .catch((err) => {
                onErrorHandler(err.message );
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
                                value={profileData.username}
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
                                value={profileData.name}
                                onChange={onChangeHandler}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Имейл</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                disabled
                                value={profileData.email}
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
                                placeholder="01-01-1990"
                                value={profileData.dateOfBirth}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
                            />
                            {errors.dateOfBirth && <span style={{ color: 'red' }}>{errors.dateOfBirth} </span>}

                        </Form.Group>
                        {error && <span style={{ color: 'red' }}>{errorMessage}</span>}

                        <Button onClick={onSetProfileSubmit} variant="primary" type="submit" disabled={errors.username || errors.dateOfBirth} >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
};

export default EditFormModal;