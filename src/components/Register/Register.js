import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { useForm } from '../../hooks/useForm';
import { useErrors } from '../../hooks/useErrors';

import styles from './Register.module.css';

const Register = () => {

    const navigate = useNavigate();

    const { userLogin } = useContext(AuthContext);
    const { formValues, onChangeHandler } = useForm({
        email: '',
        password: '',
        repeatPassword: ''
    });
    const { error, errorMessage, onErrorHandler } = useErrors();
    const [errors, setErrors] = useState(false);

    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const onBlurHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let error = null;


        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    error = 'Invalid email address';
                  }
                  break;
            case 'password':
                if (value.length < 6 || value.length > 15) {
                    error = 'Your password must be between 6 and 12 characters!';
                } else if (value.search(/[a-z]/i) < 0) {
                    error = 'Password must contain atleast one letter!';
                } else if (value.search(/[0-9]/i) < 0) {
                    error = 'Password must contain atleast one nymber!';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const { email, password, repeatPassword } = formValues;

        if (password !== repeatPassword) {
            onErrorHandler('Passwords don`t match!');
            return;
        }

        authService.register(email, password, repeatPassword)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch((err) => {
                onErrorHandler(err.message);
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
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}>
                            </input>
                            {errors.email && <span className={styles['error-msg']}>{errors.email} </span>}

                        </div>
                        <div>
                            <label htmlFor="password" >Моля въведете парола</label>
                            <input className={styles['form-control']}
                                type="password"
                                id="password"
                                name="password"
                                value={formValues.password}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}>
                            </input>
                            {errors.password && <span className={styles['error-msg']}>{errors.password} </span>}
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
                        {error && <span className={styles['error-msg']}>{errorMessage}</span>}

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