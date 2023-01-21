import styles from './BookItem.module.css';

const BookItem = ({ book }) => {
    return (
        <article className={styles['book-list']}>
            <div>
                <div className={styles['book-card']}>
                    <img className={styles['img-card']} src='img/when-breath-become-air.jpg' alt="book-img"/>
                </div>
            </div>
            <div>
                <a href="#/">И дъхът стана въздух</a>
                <div className={styles['rating']}>
                    <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                </div>
            </div>
        </article>
    );
};

export default BookItem;