import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../context/AuthContext';

import * as bookService from '../../services/bookService';
import * as favouriteBookService from '../../services/favouriteBookService';

import styles from './Details.module.css';
import Comments from './Comments';
import Spinner from '../Spinner/Spinner';
import { FavouriteBookContext } from '../../context/FavouriteBooksContext';

const Details = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToFavouriteHandler } = useContext(FavouriteBookContext);

    const [isLoading, setIsLoading] = useState(false);
    const [book, setBook] = useState({});
    const [added, setAdded] = useState(0);
    const [activeBtn, setActiveBtn] = useState({
        summary: true,
        comments: false,
        read: false
    });

    useEffect(() => {

        setIsLoading(true);

        Promise.all([
            bookService.getById(bookId),
            favouriteBookService.getMyFavouritesByBookId(bookId, user._id)
        ])
            .then(res => {
                const [book, added] = res;
                setBook(book);
                setAdded(added);
                setIsLoading(false);
            })
            .catch((err) => {
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/404');
                }, 2000);
            });
    }, [bookId, user, navigate]);

    const onAddToFavourite = () => {
        favouriteBookService.addFavouriteBook(bookId)
            .then(result => {
                setAdded(1);
                addToFavouriteHandler({ ...book, userId: user._id, newId: result._id });
            });
    };

    const onSummaryClick = () => {
        setActiveBtn({
            summary: true,
            comments: false,
            read: false
        });
    };

    const onCommentsClick = () => {
        setActiveBtn({
            summary: false,
            comments: true,
            read: false
        });
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
                        <button onClick={onSummaryClick} style={{ backgroundColor: activeBtn.summary ? '#3AAFA9' : '#c3f2ed' }}>Пълно описание</button>
                        <button onClick={onCommentsClick} style={{ backgroundColor: activeBtn.comments ? '#3AAFA9' : '#c3f2ed' }}>Мнения</button>
                    </nav>
                    <div className={styles['summary']}>
                        {activeBtn.summary && <p>{book.summary}</p>}
                        {activeBtn.comments && <Comments book={book} />}
                    </div>
                </section>
            </>}
        </>
    );
};

export default Details;