import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookContext } from '../../context/BookContext';
import styles from './BookItem.module.css';

import Rating from './Rating';

const BookItem = ({ book }) => {
    const {bookRating} = useContext(BookContext);
    const filterRating = bookRating.filter(r => r._id === book._id);

    const [rating, setRating] = useState(0);

    useEffect(() => {
        let sum = 0;
        filterRating.forEach(r => sum += r.rating);
        if (filterRating.length > 0) {
            setRating((sum/filterRating.length).toFixed(2));
        } else {
            setRating(0);
        };
    },[filterRating]);

    return (
        <article className={styles['book-list']}>
            <Link to={`/details/${book._id}`}>
                <div>
                    <div className={styles['book-card']}>
                        <img className={styles['img-card']} src={book.imageUrl} alt="book-img" />
                    </div>
                </div>
                <div className={styles['book-title']}>
                    <h3>{book.title}</h3>
                </div>
            </Link>
            <div className={styles['rating']}>
                <Rating rating={Number(rating)} canRate={false}/>
                <p className={styles['rating-count']}>{rating} ({filterRating.length})</p>
            </div>
        </article>
    );
};

export default BookItem;