import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import * as authService from '../../services/authService';

import styles from './Register.module.css';

export const Register = () => {

    const navigate = useNavigate();
    const { userLogin } = useContext(AuthContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const email = formData.get('email');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeat-password');

        if (password !== repeatPassword) {
            return;
        }

        authService.register(email, password)
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
                                name="email"></input>
                        </div>
                        <div>
                            <label htmlFor="password" >Моля въведете парола</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="passwprd"
                                name="password"></input>
                        </div>
                        <div>
                            <label htmlFor="repeat-password" >Моля повторете паролата</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="repeat-passwprd"
                                name="repeat-password"></input>
                        </div>
                            <input className={styles.register}
                                type="submit"
                                name="user-login"
                                value="Регистрирай се" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;