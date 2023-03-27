import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { useForm } from '../../hooks/useForm';
import { errors } from '../../util/error';

import styles from './Register.module.css';

const Register = () => {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const { userLogin } = useContext(AuthContext);
    const {formValues, onChangeHandler} = useForm({
        email:'',
        password:'',
        repeatPassword:''
    });

    const onSubmit = (e) => {
        e.preventDefault();

        const { email, password, repeatPassword } = formValues;
        
        if (password !== repeatPassword) {
            errors(setError, setErrorMsg, 'Passwords don`t match!');
            return;
        }

        authService.register(email, password, repeatPassword)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch((err) => {
                errors(setError, setErrorMsg, err.message);
                return;
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
                                value={formValues.email}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor="password" >Моля въведете парола</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="password"
                                name="password"
                                value={formValues.password}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor="repeatPassword" >Моля повторете паролата</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={formValues.repeatPassword}
                                onChange={onChangeHandler}>
                            </input>
                        </div>
                        {error && <p className={styles['error-msg']}>{errorMsg}</p>}

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