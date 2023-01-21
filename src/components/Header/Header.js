import { Link } from 'react-router-dom';

import styles from './Header.module.css';

import Navigation from './Navigation/Navigation';


const Header = () => {
    return (
        <header>
            <section className={styles['header']}>
                <div className={styles['logo']}>
                    <Link to="/">
                        <img src="/img/book-reads-logo.png" alt="logo" />
                    </Link>
                </div>
                <div className={styles['searher']}>
                    <input className={styles['search']} type="Какво търсиш днес?" placeholder="Какво търсиш днес?" />
                </div>
                <div className={styles['tools']}>
                    <ul className={styles['links']}>
                        <li>
                            <Link className={styles['tool']} to="/login">
                                <i class="fas fa-user-circle"></i>
                                &#160; Моят акаунт</Link>
                        </li>
                        <li>
                            <Link className={styles['tool']} to="/favourites">
                                <i class="far fa-heart"></i>
                                &#160; Любими</Link>
                        </li>
                        <li>
                            <Link className={styles['tool']} to="/myBooks">
                                <i class="fas fa-book"></i>
                                &#160; Моите книги</Link>
                        </li>
                    </ul>
                </div>
            </section>
            <Navigation />
        </header>
    );
};

export default Header;