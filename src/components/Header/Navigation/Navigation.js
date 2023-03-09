import styles from './Navigation.module.css';
import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav>
            <div className={styles['nav']}>
                <ul>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']}  to="/all-books">Всички книги</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/best-seller">Бест Селъри</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/fantasy">Фентъзи</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/fiction">Художествена литература</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/history-and-politics">История и политика</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/psychology">Психология и философия</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/autobiography">Автобиографии</NavLink></li>
                    <li><NavLink className={({isActive}) => isActive && styles['nav-active']} to="/kids-book">Детски книги</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;