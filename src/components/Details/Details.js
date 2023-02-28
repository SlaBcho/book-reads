import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Details.module.css';
import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';

import * as bookService from '../../services/bookService';
import Rating from '../Main/Catalog/BookItem/Rating';

const Details = () => {
    const { books } = useContext(BookContext);

    const { gameId } = useParams();

    const book = books.find(el => el._id === gameId);

    // useEffect(() => {
    //     bookService.getById(gameId)
    //         .then(result => {
    //             console.log(result);
    //         });
    // });

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
                        <button className={styles['favourites']}><i className="far fa-heart"></i> Добави в любими</button>
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