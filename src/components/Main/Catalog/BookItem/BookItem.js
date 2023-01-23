import styles from './BookItem.module.css';
import Rating from './Rating';

const BookItem = ({ book }) => {
    return (
        <article className={styles['book-list']}>
            <div>
                <div className={styles['book-card']}>
                    <img className={styles['img-card']} src='img/when-breath-become-air.jpg' alt="book-img" />
                </div>
            </div>
            <div className={styles['rating']}>
                <h3>И дъхът стана въздух</h3>
                <div>
                    <Rating />
                </div>
            </div>
        </article>
    );
};

export default BookItem;