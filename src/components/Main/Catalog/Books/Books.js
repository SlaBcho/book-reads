import BookItem from '../BookItem/BookItem';

import styles from './Books.module.css';

import { useContext } from 'react';
import { BookContext } from '../../../../context/BookContext';

const Books = () => {
    const { books } = useContext(BookContext);
    return (
        <section className={styles['catalog-items']}>
            {books.map(b => <BookItem key={b._id} book={b} />)}
        </section>
    );
};

export default Books;