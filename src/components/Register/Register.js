import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import * as authService from '../../services/authService';

import styles from './Register.module.css';

const Register = () => {

    const navigate = useNavigate();
    const { userLogin } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        email: '',
        password: '',
        repeatPassword: '',
    });
    

    const onChangeHandler = (e) => {
        setUserData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const { email, password, repeatPassword } = userData;

        if (password !== repeatPassword) {
            return;
        }

        authService.register(email, password, repeatPassword)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            });
    };

    return (
        <div className={styles.container}>

            <div className={styles['form-box']}>
                <div className={styles.heading}>
                    <h1>Здравей!</h1>
                </div>
                <div>
                    <form onSubmit={onSubmit}>
                        <div>
                            <label htmlFor="email" >Моля въведете имейл адрес</label>
                            <input className={styles['form-control']}
                                type="email"
                                id="email"
                                name="email"
                                value={userData.email}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor="password" >Моля въведете парола</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="password"
                                name="password"
                                value={userData.password}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor="repeatPassword" >Моля повторете паролата</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={userData.repeatPassword}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        <input className={styles.register}
                            type="submit"
                            name="user-login"
                            value="Регистрирай се" 
                            />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;