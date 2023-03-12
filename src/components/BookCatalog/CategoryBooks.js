import styles from './AllBooks.module.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import * as bookService from '../../services/bookService';

import BookItem from '../Main/Catalog/BookItem/BookItem';

const CategoryBooks = () => {
	const [bookByCategory, setBooksByCategory] = useState([]);
	const location = useLocation();

	const category = location.pathname.slice(1);

    useEffect(() => {
        bookService.getByCategory(category)
            .then(res => {
                setBooksByCategory(res);
            });
    }, [category]);

    return (
        <section className={styles['all-books']}>
            {bookByCategory.map(b => <BookItem key={b._id} book={b} />)}
        </section>
    );
};

export default CategoryBooks;