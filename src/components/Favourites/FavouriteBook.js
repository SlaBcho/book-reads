import styles from './Favourites.module.css';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';

import * as bookService from '../../services/bookService';

const FavouriteBook = ({ favourite }) => {
    const {removeFromFavouriteHandler} = useContext(BookContext);

    const onRemoveFromFavourite = () => {
        bookService.removeFavourite(favourite.newId);

        removeFromFavouriteHandler(favourite._id);
    };

    return (
        <li className={styles['favourite-book']}>
            <div className={styles['book-img']}>
                <Link to={`/details/${favourite._id}`}>
                    <img src={favourite.imageUrl} alt="book" />
                </Link>
            </div>
            <div className={styles['content']}>
                <h3>{favourite.title}</h3>
                <h4>{favourite.author}</h4>
                <button onClick={onRemoveFromFavourite} className={styles['logout']}>
                    <i className="fa-solid fa-trash-can"></i>
                    Изтрий от любими
                </button>
            </div>
        </li>
    );
};

export default FavouriteBook;