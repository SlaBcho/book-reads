import { useEffect, useState, useContext, createContext } from 'react';

import { AuthContext } from './AuthContext';

import * as profileService from '../services/profileService';

export const ProfileContext = createContext();

export const ProfileProvider = ({
    children
}) => {
    const { user } = useContext(AuthContext);
    const [profileInfo, setProfileInfo] = useState({});
    const [allProfiles, setAllProfiles] = useState([]);

    useEffect(() => {
        profileService.getAllProfiles()
            .then(res => {
                setProfileInfo(res.filter(p => p._ownerId === user._id)[0]);
                setAllProfiles(res);
            })
            .catch((err) => {
                setProfileInfo({});
            });
    }, [user]);

    const onSetProfile = (profileData) => {
        setProfileInfo(profileData);
    };

    const onEditProfile = (profileData) => {
        setProfileInfo(profileData);
        setAllProfiles(state => state.map(p => p._ownerId === user._id ? profileData : p));
    };

    return (
        <ProfileContext.Provider value={{profileInfo,allProfiles, onSetProfile, onEditProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};