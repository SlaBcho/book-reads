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
                    <input className={styles['search']} type="text" placeholder="Какво търсиш днес?" />
                </div>
                <div className={styles['tools']}>
                    <ul className={styles['links']}>
                        <li>
                            <Link className={styles['tool']} to="/login">
                                <i className="fas fa-user-circle fa-2x"></i>
                                <span>Моят акаунт</span></Link>
                        </li>
                        <li>
                            <Link className={styles['tool']} to="/favourites">
                                <i className="far fa-heart fa-2x"></i>
                                <span>Любими</span></Link>
                        </li>
                        <li>
                            <Link className={styles['tool']} to="/myBooks">
                                <i className="fas fa-book fa-2x"></i>
                                 <span>Моите книги</span></Link>
                        </li>
                    </ul>
                </div>
            </section>
            <Navigation />
        </header>
    );
};

export default Header;