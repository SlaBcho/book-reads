import styles from './Details.module.css';


import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import * as bookService from '../../services/bookService';

import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import { AuthContext } from '../../context/AuthContext';
import Comments from './Comments';

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

    const [summary, setSummary] = useState({ isActive: true });
    const [comments, setComments] = useState({ isActive: false });
    const [read, setRead] = useState({ isActive: false });


    const onSummaryClick = () => {
        setSummary({ isActive: true });
        setComments({ isActive: false });
        setRead({ isActive: false });
    };

    const onCommentsClick = () => {
        setComments({ isActive: true });
        setSummary({ isActive: false });
        setRead({ isActive: false });
    };

    const onReadClick = () => {
        setRead({ isActive: true });
        setComments({ isActive: false });
        setSummary({ isActive: false });
    };

    return (
        <>
            <section className={styles['details-section']}>
                <div className={styles['left-sidebar']}>
                    <div className={styles['image']}>
                        <img src={book.imageUrl} alt="book"></img>
                    </div>
                    <div className={styles['details']}>
                        <h2 className={styles['title']}>{book.title}</h2>
                        <span className={styles['author']}>Автор: {book.author}</span>
                        <p className={styles['description']}>{book.description}.</p>

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
            <article className={styles['bottom-bar']}>
                <nav className={styles['buttons']}>
                    <button onClick={onSummaryClick} style={{ backgroundColor: summary.isActive ? '#c5c3c3' : 'white' }}>Пълно описание</button>
                    <button onClick={onCommentsClick} style={{ backgroundColor: comments.isActive ? '#c5c3c3' : 'white' }}>Мнения</button>
                    <button onClick={onReadClick} style={{ backgroundColor: read.isActive ? '#c5c3c3' : 'white' }}>Прелисти</button>
                </nav>
                <div className={styles['summary']}>
                    {summary.isActive && <p>{book.summary}</p>}
                    {comments.isActive && <Comments book={book} />}
                    {read.isActive && <h1>Книгата все още не е налична...</h1>}
                </div>
            </article>
        </>
    );
};

export default Details;