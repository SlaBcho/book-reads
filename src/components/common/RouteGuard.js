import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

export const RouteGuard = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user.email) {
        return <Navigate to='/login' />;
    }

    return children ? children : <Outlet />;
};
