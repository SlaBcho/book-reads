import { useEffect, useState, useContext, createContext } from 'react';

import { AuthContext } from './AuthContext';

import * as profileService from '../services/profileService';

export const ProfileContext = createContext();

export const ProfileProvider = ({
    children
}) => {
    const { user } = useContext(AuthContext);
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        profileService.getMyPofile(user._id)
            .then(res => {
                setProfileInfo(res[0]);
            })
            .catch((err) => {
                setProfileInfo({});
            });
    }, [user]);

    const onSetProfile = (profileData) => {

        profileService.setMyProfile(profileData)
            .then(res => {
                setProfileInfo(res);
            });
    };

    const onEditProfile = (profileData) => {

        profileService.editMyProfile(profileInfo._id, profileData)
            .then(res => {
                console.log(res);
                setProfileInfo(res);
            });
    };

    return (
        <ProfileContext.Provider value={{profileInfo, onSetProfile, onEditProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};