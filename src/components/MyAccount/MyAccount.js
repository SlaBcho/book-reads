import { Link } from 'react-router-dom';
import styles from './MyAccount.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FavouriteBookContext } from '../../context/FavouriteBooksContext';
import { BookContext } from '../../context/BookContext';

import * as commentService from '../../services/commentService';
import { useState } from 'react';
import { useEffect } from 'react';

const MyAccount = () => {
    const { user } = useContext(AuthContext);
    const { favourite } = useContext(FavouriteBookContext);
    const { books } = useContext(BookContext);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        commentService.getAllComments(user._id)
        .then(res => {
            setComments(res);
        });
    },[user]);

    const favouriteBook = favourite.filter(b => b.userId === user._id);
    const myBooks = books.filter(b => b._ownerId === user._id);



    return (
        <section className={styles['my-account-wrapper']}>
            <section className={styles['my-account']}>
                <h2 className={styles['info-title']}>Данни за акаунта</h2>
                <div className={styles['my-account-img']}>
                    <p>SB</p>
                </div>
                <div className={styles['my-account-info']}>
                    <p>Псевдоним: Sully</p>
                    <p>Име: Slavcho Boyukliev</p>
                    <p>Рождена дата: 25/09/1990</p>
                    <p>Телефонен номер: 0877077403</p>
                    <button className={styles['manage']}>Управлявай товите данни</button>
                </div>

            </section>
            <section className={styles['my-activity']}>
                <h2 className={styles['info-title']}>Моята дейност</h2>
                <div>
                    <i className="fas fa-book fa-3x"></i>
                    <p>{myBooks.length} добавени книги</p>
                    <div className={styles['divider']}></div>
                    <Link to='/my-books'>Виж добавените книги</Link>
                </div>
                <div>
                    <i className="fa-solid fa-heart fa-3x"></i>
                    <p>{favouriteBook.length} любими книги</p>
                    <div className={styles['divider']}></div>
                    <Link to='/favourites'>Виж любимите книги</Link>
                </div>
                <div>
                    <i className="fa-solid fa-star fa-3x"></i>
                    <p>{comments.length} добавени ревюта</p>
                    <div className={styles['divider']}></div>
                    <Link to='/my-books'>Виж твоите ревюта</Link>
                </div>
            </section>
        </section>
    );
};

export default MyAccount;