import { useContext, useEffect, useState } from 'react';
import styles from './AllBooks.module.css';
import { useLocation } from 'react-router-dom';
// import Spinner from '../Spinner/Spinner';

// import * as bookService from '../../services/bookService';
import BookItem from '../BookItem/BookItem';
import { BookContext } from '../../context/BookContext';


const CategoryBooks = () => {
    const location = useLocation();
    // const [isLoading, setIsLoading] = useState(false);

    const category = location.pathname.slice(1);

    const { books } = useContext(BookContext);
    // const [bookByCategory, setBooksByCategory] = useState([]);
    const filteredBooks = books.filter(b => b.category === category);
    // setBooksByCategory(filteredBooks);
    // setBooksByCategory(state => state.filter(b => b.category === category));
    // useEffect(() => {
    //     setIsLoading(true);
    //     bookService.getByCategory(category)
    //         .then(res => {
    //             setBooksByCategory(res);
    //             setIsLoading(false);
    //         });
    // }, [category]);

    return (
        <section className={styles['all-books']}>
            {filteredBooks?.map(b => <BookItem key={b._id} book={b} />) || []}
        </section>
    );
};

export default CategoryBooks;