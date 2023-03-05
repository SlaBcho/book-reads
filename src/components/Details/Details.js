import styles from './Details.module.css';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import * as bookService from '../../services/bookService';

import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import { AuthContext } from '../../context/AuthContext';

const Details = () => {
    const { addToFavouriteHandler } = useContext(BookContext);
    const { user } = useContext(AuthContext);

    const [book, setBook] = useState({});
    const [added, setAdded] = useState(0);

    const { bookId } = useParams();

    useEffect(() => {
        bookService.getById(bookId)
            .then(res => {
                setBook(res);
            });
    }, [bookId]);

    useEffect(() => {
        bookService.getMyFavouritesByBookId(bookId, user._id)
            .then(res => {
                setAdded(res);
            });
    }, [bookId, user._id]);

    const onAddToFavourite = () => {
        bookService.favouriteBook(bookId)
            .then(result => {
                setAdded(1);
                addToFavouriteHandler({ ...book, userId: user._id, newId: result._id });
            });
    };

    return (
        <>
            <section className={styles['details-section']}>
                <div className={styles['left-sidebar']}>
                    <div className={styles['image']}>
                        <img src={book.imageUrl} alt="book"></img>
                    </div>
                    <div className={styles['details']}>
                        <h2>{book.title}</h2>
                        <span>Автор: {book.author}</span>

                        <p>{book.description}.</p>

                        {(user.email && added < 1) ?
                            (<button onClick={onAddToFavourite} className={styles['favourites']}>
                                <i className="far fa-heart"></i>
                                Добави в любими
                            </button>) : null
                        }
                    </div>
                </div>
                <div className={styles['right-sidebar']}>
                    <table>
                        <tbody>
                            <tr>
                                <th>Автор</th>
                                <td>{book.author}</td>
                            </tr>
                            <tr>
                                <th>Година на издаване</th>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <th>Корица</th>
                                <td>мека</td>
                            </tr>
                            <tr>
                                <th>Страници</th>
                                <td>196</td>
                            </tr>
                            <tr>
                                <th>Език</th>
                                <td>български</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className={styles['bottom-bar']}>
                <div className={styles['buttons']}>
                    <button>Пълно описание</button>
                    <button>Мнения</button>
                    <button>Прелисти</button>
                </div>
                <div className={styles['summary']}>
                    <p>{book.summary}</p>
                </div>
            </section>
        </>
    );
};

export default Details;