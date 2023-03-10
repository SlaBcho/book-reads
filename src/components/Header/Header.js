import styles from './Header.module.css';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import Navigation from './Navigation/Navigation';
import { BookContext } from '../../context/BookContext';

const Header = () => {
    const { user } = useContext(AuthContext);
    const { onSearchBook } = useContext(BookContext);

    const onSearch = (e) => {
        onSearchBook(e);
    };
    
    return (
        <header>
            <section className={styles['header']}>
                <div className={styles['logo']}>
                    <Link to="/">
                        <img src="/img/book-reads-logo.png" alt="logo" />
                    </Link>
                </div>

                <form onSubmit={onSearch} className={styles['searcher']}>
                    <input className={styles['search']} name="search" type="text" placeholder="Какво търсиш днес?" />
                    <button className={styles['search-logo']} type="submit"><i className="fa fa-search fa-2x"></i></button>
                </form>

                <div className={styles['tools']}>
                    <ul className={styles['links']}>
                        <li>
                            {user.email ? (
                                <Link className={styles['tool']} to="/logout">
                                    <i className="fa-solid fa-arrow-right-from-bracket fa-2x"></i>
                                    <span>Изход</span>
                                </Link>
                            ) : (
                                <Link className={styles['tool']} to="/login">
                                    <i className="fas fa-user-circle fa-2x"></i>
                                    <span>Вход/Регистрация</span>
                                </Link>
                            )}

                        </li>
                        <li>
                            <Link className={styles['tool']} to="/favourites">
                                <i className="far fa-heart fa-2x"></i>
                                <span>Любими</span>
                            </Link>
                        </li>
                        <li>
                            <Link className={styles['tool']} to="/my-books">
                                <i className="fas fa-book fa-2x"></i>
                                <span>Моите книги</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
            <Navigation />
        </header >
    );
};

export default Header;