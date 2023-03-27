import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { BookContext } from '../../context/BookContext';
import * as favouriteBookService from '../../services/favouriteBookService';

import styles from './Favourites.module.css';
import ChoiceModal from '../Modal/ChoiceModal';

const FavouriteBook = ({ favourite }) => {
    const { removeFromFavouriteHandler } = useContext(BookContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onRemoveFromFavourite = () => {
        favouriteBookService.removeFavourite(favourite.newId);
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
                <button onClick={handleShow} className={styles['logout']}>
                    <i className="fa-solid fa-trash-can"></i>
                    Изтрий от любими
                </button>
            <ChoiceModal show={show} handleClose={handleClose} onRemoveFromFavourite={onRemoveFromFavourite} title={favourite.title}/>
            </div>
        </li>
    );
};

export default FavouriteBook;