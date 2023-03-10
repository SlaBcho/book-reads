import styles from './Details.module.css';
import Comments from './Comments';

import { useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';

import * as bookService from '../../services/bookService';
import { BookContext } from '../../context/BookContext';
import { AuthContext } from '../../context/AuthContext';
import BookContent from './BookContent';
import Spinner from '../Spinner/Spinner';

const Details = () => {
    const { addToFavouriteHandler } = useContext(BookContext);
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);


    const [book, setBook] = useState({});
    const [added, setAdded] = useState(0);

    const { bookId } = useParams();

    useEffect(() => {
        setIsLoading(true);
        bookService.getById(bookId)
            .then(res => {
                setBook(res);
            });
    }, [bookId]);

    useEffect(() => {
        bookService.getMyFavouritesByBookId(bookId, user._id)
            .then(res => {
                setAdded(res);
                setIsLoading(false);
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
        {isLoading ? <Spinner /> : <>
            <section className={styles['details-section']}>
                <div className={styles['left-sidebar']}>
                    <div className={styles['image']}>
                        <img src={book.imageUrl} alt="book"></img>
                    </div>
                    <div className={styles['details']}>
                        <h2 className={styles['title']}>{book.title}</h2>
                        <span className={styles['author']}>??????????: {book.author}</span>
                        <p className={styles['description']}>{book.description}.</p>

                        {(user.email && added < 1) ?
                            (<button onClick={onAddToFavourite} className={styles['favourites']}>
                                <i className="far fa-heart"></i>
                                ???????????? ?? ????????????
                            </button>) : null
                        }
                    </div>
                </div>
                <div className={styles['right-sidebar']}>
                    <table>
                        <tbody>
                            <tr>
                                <th>??????????</th>
                                <td>{book.author}</td>
                            </tr>
                            <tr>
                                <th>???????????? ???? ????????????????</th>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <th>????????????</th>
                                <td>????????</td>
                            </tr>
                            <tr>
                                <th>????????????????</th>
                                <td>196</td>
                            </tr>
                            <tr>
                                <th>????????</th>
                                <td>??????????????????</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className={styles['bottom-bar']}>
                <nav className={styles['buttons']}>
                    <button onClick={onSummaryClick} style={{ backgroundColor: summaryView.isActive ? '#c5c3c3' : 'white' }}>?????????? ????????????????</button>
                    <button onClick={onCommentsClick} style={{ backgroundColor: commentView.isActive ? '#c5c3c3' : 'white' }}>????????????</button>
                    <button onClick={onReadClick} style={{ backgroundColor: readView.isActive ? '#c5c3c3' : 'white' }}>????????????????</button>
                </nav>
                <div className={styles['summary']}>
                    {summaryView.isActive && <p>{book.summary}</p>}
                    {commentView.isActive && <Comments book={book} setSummaryView={setSummaryView} setCommentView={setCommentView} />}
                    {readView.isActive && <BookContent book={book}/>}
                </div>
            </section>
            </> }
        </>
    );
};

export default Details;