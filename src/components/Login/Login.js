import styles from './Login.module.css';

import { Link, useNavigate } from 'react-router-dom';

import * as authService from '../../services/authService';

import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {

    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        email:'',
        password:''
    });
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onChangeHandler = (e) => {
        setUserData(state => ({...state, [e.target.name]:e.target.value}));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const {email, password} = userData;

        authService.login(email, password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch((err) => {
                setError(true);
                setErrorMsg(err.message);
                setTimeout(() => {
                    setError(false);
                  }, 2000);
                return;
            });
    };

    return (
            <div className={styles['container']}>
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
                                        <label htmlFor="user_login_password" >Моля въведете парола</label>
                                        <input className={styles['form-control']}
                                            type="password"
                                            id="passwprd"
                                            name="password"
                                            value={userData.password}
                                            onChange={onChangeHandler}>
                                            </input>
                                    </div>
                                    {error && <p className={styles['error-msg']}>{errorMsg}</p>}

                                    <input className={styles.continue}
                                        type="submit"
                                        name="user-login"
                                        value="Продължи" />
                                </form>
                                    <p> Нямате акаунт? Не се тревожете!</p>
                                <div className={styles.text}>
                                    <Link to="/register">
                                        <input className={styles.register}
                                            type="submit"
                                            name="user-register"
                                            value="Регистрация" />
                                    </Link>
                                </div>
                            </div>
                        </div>
            </div>
    );
};

export default Login;