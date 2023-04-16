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
        profileService.getMyPofile(user._id)
            .then(res => {
                setProfileInfo(res[0]);
            })
            .catch((err) => {
                setProfileInfo({});
            });
    }, [user]);

    const onSetProfile = (profileData) => {
        setProfileInfo(profileData);
        setAllProfiles(state => [...state, profileData]);
    };

    const onEditProfile = (profileData) => {
        setProfileInfo(profileData);
        setAllProfiles(state => state.map(p => p.email === profileData.email ? profileData : p));
    };

    return (
        <ProfileContext.Provider value={{profileInfo,allProfiles, onSetProfile, onEditProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};