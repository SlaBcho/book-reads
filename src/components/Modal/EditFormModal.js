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
    const { error, errorMessage, onErrorHandler } = useErrors();

    useEffect(() => {
        setProfileData(profileInfo);
    }, [profileInfo]);

    const onChangeHandler = (e) => {
        setProfileData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onSetProfileSubmit = (e) => {
        e.preventDefault();


        if (allProfiles && allProfiles.find(el => el.username === profileData.username)) {
            onErrorHandler('This username already exist!');
            return;
        }

        profileService.editMyProfile(profileInfo._id, profileData)
            .then(res => {
                onEditProfile(res);
            });

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
                                value={profileData.username}
                                onChange={onChangeHandler} />
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
                            />
                        </Form.Group>
                        {error && <p style={{ color: 'red' }}>{errorMessage}</p>}

                        <Button onClick={onSetProfileSubmit} variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
};

export default EditFormModal;