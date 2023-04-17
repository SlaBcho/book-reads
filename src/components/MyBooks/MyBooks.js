import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { BookContext } from '../../context/BookContext';
import * as bookService from '../../services/bookService';

import Spinner from '../Spinner/Spinner';
import MyBook from './MyBook';
import styles from './MyBooks.module.css';
import { ProfileContext } from '../../context/ProfileContext';

const MyBooks = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { detelteBookHandler } = useContext(BookContext);
    const { user } = useContext(AuthContext);
    const { profileInfo } = useContext(ProfileContext);

    useEffect(() => {
        setIsLoading(true);
        bookService.getMyBooks(user._id)
            .then(res => {
                setMyBooks(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setMyBooks([]);
                setIsLoading(false);
            });
    }, [user]);

    const onBookDelete = async (bookId) => {
        await bookService.remove(bookId);
        detelteBookHandler(bookId);
        setMyBooks(state => state.filter(b => b._id !== bookId));
    };

    return (

        <>
        {isLoading ? <Spinner /> : 
            <section className={styles['container']}>
                {user.email ? (
                    <article className={styles['user-container']}>
                        <div className={styles['img']}>
                            <i className="fas fa-user-circle fa-10x"></i>
                        </div>
                        <div>
                            <h3>Здравей</h3>
                            {profileInfo.name ?
                                <p>{profileInfo.name}</p>
                                :
                                <p>{user.email}</p>
                            }
                        </div>
                        <div className={styles['logoutBtn']}>
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
                            <p>Влез в твоя акаунт или се регистрирай, за да можеш да добавиш своя любима книги.</p>
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
                {myBooks.length === 0 && !user.email && (
                    <article className={styles['favourite-container']}>
                        <h2>Мои 0 книги</h2>
                        <hr />
                        <div >
                            <img className={styles['image']} src="img/favourite.webp" alt="favourite" />
                            <h3>Хмм, няма нито един продукт в твоя списък.</h3>
                            <h3>Виж някои препоръки, които могат да те вдъхновят.</h3>
                            <p>Добави любима книга в секция Моите Книги и си направи списъци според твоите предпочитания.</p>
                            <p>Можеш да ги споделиш по всяко време с приятели.</p>
                        </div>
                    </article>
                ) }
                {myBooks.length === 0 && user.email && (
                    <article className={styles['favourite-container']}>
                        <h2>Мои 0 книги</h2>
                        <hr />
                        <div >
                            <img className={styles['image']} src="img/favourite.webp" alt="favourite" />
                            <h3>Хмм, няма нито един продукт в твоя списък.</h3>
                            <h3>Виж някои препоръки, които могат да те вдъхновят.</h3>
                            <p>Добави любима книга в секция Моите Книги и си направи списъци според твоите предпочитания.</p>
                            <p>Можеш да ги споделиш по всяко време с приятели.</p>
                        </div>
                        <Link className={styles['create']} to="/create">
                            Добавете книга
                        </Link>
                    </article>
                ) }
                {myBooks.length > 0 && user.email && (
                
                    < article className={styles['favourite-container']}>
                        <h2>Мои {myBooks.length} книги</h2>
                        <hr />

                        <ul >
                            {myBooks?.map(b => <MyBook key={b._id} myBook={b} onBookDelete={onBookDelete} />) || []}
                        </ul>
                        <Link className={styles['create']} to="/create">
                            Добавете още книги
                        </Link>
                    </article>
                )}
            </section>
            }
        </>
    );
};

export default MyBooks;