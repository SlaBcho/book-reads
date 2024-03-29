import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as authService from '../../services/authService';

import { AuthContext } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useErrors } from '../../hooks/useErrors';

import styles from './Login.module.css';

const Login = () => {

    const navigate = useNavigate();

    const { userLogin } = useContext(AuthContext);
    const { formValues, onChangeHandler } = useForm({
        email: '',
        password: ''
    });

    const { error, errorMessage, onErrorHandler } = useErrors();

    const onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = formValues;
        
        authService.login(email, password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch((err) => {
                onErrorHandler(err.message);
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
                                value={formValues.email}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor="user_login_password" >Моля въведете парола</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="passwprd"
                                name="password"
                                value={formValues.password}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        {error && <span className={styles['error-msg']}>{errorMessage}</span>}

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