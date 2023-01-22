import styles from './Register.module.css';

export const Register = () => {
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
                            <label for="password" >Моля въведете парола</label>
                            <input className={styles['form-control']} type="password" id="passwprd" name="password"></input>
                        </div>
                        <div>
                            <label for="repeat-password" >Моля повторете паролата</label>
                            <input className={styles['form-control']} type="password" id="repeat-passwprd" name="repeat-password"></input>
                        </div>

                        <input className={styles.continue} type="submit" name="user-login" value="Регистрирай се" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;