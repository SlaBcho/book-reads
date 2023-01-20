import Navigation from './Navigation/Navigation';

import styles from './Header.module.css';

const Header = () => {
    return (
        <header>
            <section className={styles['header']}>
                <div className={styles['logo']}>
                    <a href="/">
                        <img src="/img/book-reads-logo.png" alt="logo" />
                    </a>
                        <span>BookReads</span>
                </div>
                <div className={styles['searher']}>
                    <input className={styles['search']} type="Какво търсиш днес?" placeholder="Какво търсиш днес?" />
                </div>
                <div className={styles['tools']}>
                    <ul className={styles['links']}>
                        <li>
                            <a className={styles['tool']} href="/favourites">&#160; Вход</a>
                        </li>
                        <li>
                            <a className={styles['tool']} href="/favourites">&#160; Любими</a>
                        </li>
                        <li>
                            <a className={styles['tool']} href="/cart">&#160; Моите книги</a>
                        </li>
                    </ul>
                </div>
            </section>
            <Navigation />
        </header>
    );
};

export default Header;