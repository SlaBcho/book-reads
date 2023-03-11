import styles from './Details.module.css';
import Comments from './Comments';

import { useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';

import * as bookService from '../../services/bookService';
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

    const [summaryView, setSummaryView] = useState({ isActive: true });
    const [commentView, setCommentView] = useState({ isActive: false });
    const [readView, setReadView] = useState({ isActive: false });


    const onSummaryClick = () => {
        setSummaryView({ isActive: true });
        setCommentView({ isActive: false });
        setReadView({ isActive: false });
    };

    const onCommentsClick = () => {
        setCommentView({ isActive: true });
        setSummaryView({ isActive: false });
        setReadView({ isActive: false });
    };

    const onReadClick = () => {
        setReadView({ isActive: true });
        setCommentView({ isActive: false });
        setSummaryView({ isActive: false });
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
            <section className={styles['bottom-bar']}>
                <nav className={styles['buttons']}>
                    <button onClick={onSummaryClick} style={{ backgroundColor: summaryView.isActive ? '#c5c3c3' : 'white' }}>Пълно описание</button>
                    <button onClick={onCommentsClick} style={{ backgroundColor: commentView.isActive ? '#c5c3c3' : 'white' }}>Мнения</button>
                    <button onClick={onReadClick} style={{ backgroundColor: readView.isActive ? '#c5c3c3' : 'white' }}>Прелисти</button>
                </nav>
                <div className={styles['summary']}>
                    {summaryView.isActive && <p>{book.summary}</p>}
                    {commentView.isActive && <Comments book={book} setSummaryView={setSummaryView} setCommentView={setCommentView} />}
                    {readView.isActive && <h1>Книгата все още не е налична...</h1>}
                </div>
            </section>
        </>
    );
};

export default Details;