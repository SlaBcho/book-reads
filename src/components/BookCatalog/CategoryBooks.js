import { useEffect, useState } from 'react';
import styles from './AllBooks.module.css';
import { useLocation } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

import * as bookService from '../../services/bookService';

import BookItem from '../Main/Catalog/BookItem/BookItem';

const CategoryBooks = () => {
    const [bookByCategory, setBooksByCategory] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const category = location.pathname.slice(1);

    useEffect(() => {
        setIsLoading(true);
        bookService.getByCategory(category)
            .then(res => {
                setBooksByCategory(res);
                setIsLoading(false);
            });
    }, [category]);

    return (
        <>
            {isLoading ? <Spinner /> :
                <section className={styles['all-books']}>
                    {bookByCategory?.map(b => <BookItem key={b._id} book={b} />) || []}
                </section>
            }
        </>
    );
};

export default CategoryBooks;