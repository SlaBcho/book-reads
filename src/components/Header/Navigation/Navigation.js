import styles from './Navigation.module.css';

const Navigation = () => {
    return (
        <nav>
            <div className={styles['nav']}>
                <ul>
                    <li><a className={styles['nav-button']} href="/#">Всички книги</a></li>
                    <li><a className={styles['nav-button']} href="/#">Бест селъри</a></li>
                    <li><a className={styles['nav-button']} href="/#">Топ Заглавия</a></li>
                    <li><a className={styles['nav-button']} href="/#">Художествена литература</a></li>
                    <li><a className={styles['nav-button']} href="/#">Икономика и бизнес</a></li>
                    <li><a className={styles['nav-button']} href="/#">Психология и философия</a></li>
                    <li><a className={styles['nav-button']} href="/#">Автобиографии</a></li>
                    <li><a className={styles['nav-button']} href="/#">Научна литература</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;