import BookItem from '../BookItem/BookItem';

import styles from './Books.module.css';

import { useEffect, useState } from 'react';

import * as bookService from '../../../../services/bookService';


const Books = ({ criteria }) => {
    const [sortedBooks, setSortedBooks] = useState([]);

    useEffect(() => {
        bookService.getByCriteria(criteria)
            .then(res => {
                setSortedBooks(res);
            });
    });
    return (
        <section className={styles['catalog-items']}>
            {sortedBooks ? sortedBooks.slice(0,10).map(b => <BookItem key={b._id} book={b} />) : null}
        </section>
    );
};

export default Books;