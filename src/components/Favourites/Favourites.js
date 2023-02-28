import { Link } from 'react-router-dom';
import styles from './Favourites.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FavouriteBook from './FavouriteBook';
import { BookContext } from '../../context/BookContext';

const Favourites = () => {

    const { user } = useContext(AuthContext);
    const { favourite } = useContext(BookContext);

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
                            <Link to="/logout">
                                <button className={styles['logout']}><i class="fa-solid fa-arrow-right-from-bracket"></i>Изход</button>
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
                            <Link to="/login">
                                <button className={styles['login']}>Влез в акаунт</button>
                            </Link>
                            <Link to="/register">
                                <button className={styles['register']}>Нов акаунт</button>
                            </Link>
                        </div>
                    </article>
                )}
                {favourite.length === 0 || !user.email ? (
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
                        <Link to="/all-books">
                            <button className={styles['login']}>Виж още книги</button>
                        </Link>
                    </article>
                ) : (
                    < article className={styles['favourite-container']}>
                        <h2>Любими 0 книги</h2>
                        <hr />
                        <ul >
                            {favourite.map(b => <FavouriteBook key={b._id} favourite={b}/>)}
                        </ul>
                        <Link to="/all-books">
                            <button className={styles['login']}>Виж още книги</button>
                        </Link>
                    </article>
                )}

            </section>
        </>
    );
};

export default Favourites;