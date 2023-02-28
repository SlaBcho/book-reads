import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookContext } from '../../context/BookContext';
import styles from './Favourites.module.css';

const FavouriteBook = ({ favourite }) => {

    const {removeFromFavouriteHandler} = useContext(BookContext);

    return (
        <li className={styles['favourite-book']}>
            <div className={styles['book-img']}>
                <Link to="/details/:bookId">
                    <img src={favourite.imageUrl} alt="book" />
                </Link>
            </div>
            <div className={styles['content']}>
                <h3>{favourite.title}</h3>
                <h4>{favourite.author}</h4>
                <button onClick={() => removeFromFavouriteHandler(favourite._id)} className={styles['logout']}>
                    <i class="fa-solid fa-trash-can"></i>
                    Изтрий от любими
                </button>
            </div>
        </li>
    );
};

export default FavouriteBook;