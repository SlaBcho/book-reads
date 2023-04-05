import { useContext, useEffect, useState } from 'react';
import styles from './AllBooks.module.css';
import { useParams } from 'react-router-dom';
import BookItem from '../BookItem/BookItem';
// import { BookContext } from '../../context/BookContext';
import * as bookService from '../../services/bookService';
import Spinner from '../Spinner/Spinner';


const CategoryBooks = () => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [bookByCategory, setBooksByCategory] = useState([]);
    const { category } = useParams();
    // const { books } = useContext(BookContext);
    // const filteredBooks = books.filter(b => b.category === category);

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