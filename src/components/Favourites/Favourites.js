import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { FavouriteBookContext } from '../../context/FavouriteBooksContext';

import FavouriteBook from './FavouriteBook';
import styles from './Favourites.module.css';

const Favourites = () => {
    const { user } = useContext(AuthContext);
    const { favourite } = useContext(FavouriteBookContext);

    const favouriteBook = favourite.filter(b => b.userId === user._id);
    return (
        <>
            <section className={styles['container']}>
                {user.email ? (
                    <article className={styles['user-container']}>
                        <div className={styles['img']}>
                            <i className="fas fa-user-circle fa-10x"></i>
                        </div>
                        <div>
                            <h3>Здравей</h3>
                                <p>{user.email}</p>
                        </div>
                        <div>
                            <Link className={styles['logout']} to="/logout">
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                Изход
                            </Link>
                        </div>
                    </article>) : (
                    <article className={styles['user-container']}>
                        <div className={styles['img']}>
                            <i className="fas fa-user-circle fa-10x"></i>
                        </div>
                        <div>
                            <h3>Хей, сега си анонимен user.</h3>
                            <p>Влез в твоя акаунт или се регистрирай, за да можеш да запазиш любимите си книги.</p>
                        </div>
                        <div>
                            <Link className={styles['login']} to="/login">
                                Влез в акаунт
                            </Link>
                            <Link className={styles['register']} to="/register">
                                Нов акаунт
                            </Link>
                        </div>
                    </article>
                )}
                {favouriteBook.length === 0 || !user.email ? (
                    <article className={styles['favourite-container']}>
                        <h2>Любими 0 книги</h2>
                        <hr />
                        <div >
                            <img className={styles['image']} src="img/favourite.webp" alt="favourite" />
                            <h3>Хмм, няма нито един продукт в твоя списък.</h3>
                            <h3>Виж някои препоръки, които могат да те вдъхновят.</h3>
                            <p>Добави в Любими и си направи списъци според твоите предпочитания.</p>
                            <p>Можеш да ги споделиш по всяко време с приятели.</p>
                        </div>
                        <Link className={styles['login']} to="/all-books">
                            Виж всички книги
                        </Link>
                    </article>
                ) : (
                    < article className={styles['favourite-container']}>
                        <h2>Любими {favouriteBook.length} книги</h2>
                        <hr />
                        <ul >
                            {favouriteBook?.map(b => <FavouriteBook key={b._id} favourite={b} />) || []}
                        </ul>
                        <Link className={styles['login']} to="/all-books">
                            Добавете още книги
                        </Link>
                    </article>
                )}

            </section>
        </>
    );
};

export default Favourites;