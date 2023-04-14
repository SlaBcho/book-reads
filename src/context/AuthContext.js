import { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();

export const AuthProvider = ({
    children
}) => {
    const [auth, setAuth] = useLocalStorage('auth', {});

    const userLogin = (authData) => {
        setAuth({
            accessToken: authData.accessToken,
            email: authData.email,
            _id: authData._id,
            firstName: authData.firstName,
            lastName: authData.lastName,
            username: authData.username
        });
    };

    const userLogout = () => {
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{ user: auth, userLogin, userLogout }}>
            {children}
        </AuthContext.Provider>
    );
};