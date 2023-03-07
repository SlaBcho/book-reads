import styles from './Navigation.module.css';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav>
            <div className={styles['nav']}>
                <ul>
                    <li><Link className={styles['nav-button']} to="/all-books">Всички книги</Link></li>
                    <li><Link className={styles['nav-button']} to="/best-seller">Бест Селъри</Link></li>
                    <li><Link className={styles['nav-button']} to="/fantasy">Фентъзи</Link></li>
                    <li><Link className={styles['nav-button']} to="/fiction">Художествена литература</Link></li>
                    <li><Link className={styles['nav-button']} to="/history-and-politics">История и политика</Link></li>
                    <li><Link className={styles['nav-button']} to="/psychology">Психология и философия</Link></li>
                    <li><Link className={styles['nav-button']} to="/autobiography">Автобиографии</Link></li>
                    <li><Link className={styles['nav-button']} to="/kids-book">Детски книги</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;