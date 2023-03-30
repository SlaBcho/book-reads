import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

export const RouteGuard = () => {
    const {user} = useContext(AuthContext);

    if(!user.email) {
        return <Navigate to='/login' />;
    }

    return <Outlet />;
};
