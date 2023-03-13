import { useState } from 'react';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

import * as authService from '../../services/authService';
import Spinner from '../Spinner/Spinner';

const Logout = () => {
    const navigate = useNavigate();
    const { user, userLogout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        authService.logout(user.accessToken)
            .then(() => {
                navigate('/');
                userLogout();
                setIsLoading(false);
            });
        // .catch(() => {
        //     navigate('/');
        // });
    },[]);

    return (<>
        {isLoading ? (<Spinner />) : null}
    </>
    );
};

export default Logout;