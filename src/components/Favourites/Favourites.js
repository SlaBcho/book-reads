import { Link } from 'react-router-dom';
import styles from './Favourites.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Favourites = () => {

    const { user } = useContext(AuthContext);

    return (
        <>
            {/* for not logged user */}


            {user.email ? (<section className={styles['container']}>
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
                </article>
                <article className={styles['favourite-container']}>
                    <h2>Любими 0 книги</h2>
                    <hr />
                    <ul >
                        <li className={styles['favourite-book']}>
                            <div className={styles['book-img']}>
                                <Link to="/details/:bookId">
                                    <img src="img/when-breath-become-air.jpg" alt="book" />
                                </Link>
                            </div>
                            <div className={styles['content']}>
                                <h3>И дъхът стана въздух</h3>
                                <h4>Поул Каланити</h4>
                                <button className={styles['logout']}><i class="fa-solid fa-trash-can"></i>Изтрий от любими</button>
                            </div>
                        </li>
                        <li className={styles['favourite-book']}>
                            <div className={styles['book-img']}>
                                <Link to="/details/:bookId">
                                    <img src="img/when-breath-become-air.jpg" alt="book" />
                                </Link>
                            </div>
                            <div className={styles['content']}>
                                <h3>И дъхът стана въздух</h3>
                                <h4>Поул Каланити</h4>
                                <button className={styles['logout']}><i class="fa-solid fa-trash-can"></i>Изтрий от любими</button>
                            </div>
                        </li>
                        <li className={styles['favourite-book']}>
                            <div className={styles['book-img']}>
                                <Link to="/details/:bookId">
                                    <img src="img/when-breath-become-air.jpg" alt="book" />
                                </Link>
                            </div>
                            <div className={styles['content']}>
                                <h3>И дъхът стана въздух</h3>
                                <h4>Поул Каланити</h4>
                                <button className={styles['logout']}><i class="fa-solid fa-trash-can"></i>Изтрий от любими</button>
                            </div>
                        </li>
                    </ul>
                    <button className={styles['login']}><Link to="/">Виж още книги</Link></button>
                </article>
            </section>)
                : (<section className={styles['container']}>
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
                        <button className={styles['login']}><Link to="/">Виж още книги</Link></button>
                    </article>
                </section>)}

        </>
    );
};

export default Favourites;