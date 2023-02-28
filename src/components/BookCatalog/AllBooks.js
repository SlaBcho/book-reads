import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';

import BookItem from '../Main/Catalog/BookItem/BookItem';
import styles from './AllBooks.module.css';

const AllBooks = () => {

    const { books } = useContext(BookContext);


    return (
        <section className={styles['all-books']}>
            {books.map(b => <BookItem key={b._id} book={b} />)}
        </section>
    );
};

export default AllBooks;