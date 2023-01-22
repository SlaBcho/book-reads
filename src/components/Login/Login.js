import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();

    const onRegister = () => {
        navigate('/register');
    };

    return (
        <div className={styles.container}>
            
            <div className={styles['form-box']}>
                <div className={styles.heading}>
                    <h1>Здравей!</h1>
                </div>
                <div>
                    <form>
                        <div>
                            <label for="email" >Моля въведете имейл адрес</label>
                            <input className={styles['form-control']} type="email" id="email" name="email"></input>
                        </div>
                        <div>
                            <label for="user_login_password" >Моля въведете парола</label>
                            <input className={styles['form-control']} type="password" id="passwprd" name="password"></input>
                        </div>

                        <input className={styles.continue} type="submit" name="user-login" value="Продължи" />
                    </form>
                    <div className={styles.text}>
                       <p> Нямате акаунт? Не се тревожете!</p>
                        <input onClick={onRegister} className={styles.register} type="submit" name="user-register" value="Регистрация" />
                    </div>
                </div>
            </div>
        </div>
    );
};