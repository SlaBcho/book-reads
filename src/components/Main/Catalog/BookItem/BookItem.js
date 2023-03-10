import { Link } from 'react-router-dom';
import styles from './BookItem.module.css';

import Rating from './Rating';

const BookItem = ({ book }) => {
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
                <Rating />
                <p className={styles['rating-count']}>{book.rating} (0)</p>
            </div>
        </article>
    );
};

export default BookItem;