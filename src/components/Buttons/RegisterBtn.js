import { Link } from 'react-router-dom';

import styles from './Buttons.module.css';

const RegisterBtn = () => {
    return (
        <Link to="/register">
            <input className={styles.register}
                type="submit"
                name="user-register"
                value="Регистрация" />
        </Link>
    );
};

export default RegisterBtn;