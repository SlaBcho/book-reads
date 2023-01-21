import styles from './Login.module.css';


export const Login = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <a href="/">
                    <img id="logo" src="/img/book-reads-logo.png" alt="emagLogo" />
                </a>
            </div>
            <div className={styles['form-box']}>
                <div className={styles.heading}>
                    <h1>Здравей!</h1>
                </div>
                <div>
                    <form>
                        <div>
                            <label for="user_login_email" >Моля въведи имейл адрес</label>
                            <input className={styles['form-control']} type="email" id="user_login_email" name="email"></input>
                        </div>
                        <div>
                            <label for="user_login_password" >Моля въведи парола</label>
                            <input className={styles['form-control']} type="password" id="user_login_passwprd" name="password"></input>
                        </div>

                        <input className={styles.continue} type="submit" name="user-login" value="Продължи" />
                    </form>
                    <div className={styles.text}>
                       <p> Нямаш акаунт? Не се тревожи!</p>
                        <input className={styles.register} type="submit" name="user-login" value="Регистрация" />
                    </div>
                </div>
            </div>
        </div>
    );
};