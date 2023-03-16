import { Link } from 'react-router-dom';

import styles from './Buttons.module.css';

const LoginBtn = () => {
    return (
        <Link className={styles['login']} to="/login">
            Влез в акаунт
        </Link>
    );
};

export default LoginBtn;