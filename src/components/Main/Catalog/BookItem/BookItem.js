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
            <div className={styles['rating']}>
                <h3>{book.title}</h3>
                <div>
                    <Rating />
                </div>
            </div>
        </Link>
        </article>
    );
};

export default BookItem;