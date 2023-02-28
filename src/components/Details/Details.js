import { useParams } from 'react-router-dom';
import styles from './Details.module.css';
import { useState, useEffect } from 'react';

import * as bookService from '../../services/bookService';
import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import { AuthContext } from '../../context/AuthContext';
// import Rating from '../Main/Catalog/BookItem/Rating';

const Details = () => {
    const { addToFavouriteHandler } = useContext(BookContext);
    const [book, setBook] = useState([]);
    const { bookId } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        bookService.getById(bookId)
            .then(res => {
                setBook(res);
            }, []);
    });

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
                        {user.email &&
                            (<button onClick={() => addToFavouriteHandler(book)} className={styles['favourites']}>
                                <i className="far fa-heart"></i>
                                Добави в любими
                            </button>)
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