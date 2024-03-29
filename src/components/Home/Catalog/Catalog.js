import styles from './Catalog.module.css';
import { useContext, useState } from 'react';
import { BookContext } from '../../../context/BookContext';
import BookItem from '../../BookItem/BookItem';

const Catalog = () => {
    const { books } = useContext(BookContext);

    const[highestRating, sethighestRating] = useState(() => {
        const ratedBooks = books.sort((a,b) => b.rating - a.rating);
        return ratedBooks;
    });
    const newestBooks = [...books].sort((a, b) => b._createdOn - a._createdOn);

    return (
        <section className={styles['catalog']}>
            <h2 className={styles['articles-name']}>Най-нови книги</h2>
            <section className={styles['catalog-items']}>
                {newestBooks?.slice(0, 10).map(b => <BookItem key={b._id} book={b} />) || []}
            </section>

            <h2 className={styles['articles-name']}>Книги с най-висок рейтинг</h2>
            <section className={styles['catalog-items']}>
                {highestRating?.slice(0, 10).map(b => <BookItem key={b._id} book={b} />) || []}
            </section>
        </section>
    );
};

export default Catalog;