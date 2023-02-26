import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const Login = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const {
            email,
            password
        } = Object.fromEntries(new FormData(e.target));

        authService.login(email, password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch(() => {
                navigate('/404');
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
                                name="email"></input>
                        </div>
                        <div>
                            <label htmlFor="user_login_password" >Моля въведете парола</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="passwprd"
                                name="password"></input>
                        </div>

                        <input className={styles.continue}
                            type="submit"
                            name="user-login"
                            value="Продължи" />
                    </form>
                    <div className={styles.text}>
                        <p> Нямате акаунт? Не се тревожете!</p>
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