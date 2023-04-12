import { useEffect, useState } from 'react';
import styles from './AllBooks.module.css';
import { Navigate, useParams } from 'react-router-dom';
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
            })
            .catch((err) => {
                setTimeout(() => {
                    setIsLoading(false);
                    setBooksByCategory([]);
                }, 2000);

            });
    }, [category]);

    return (
        <>
            {isLoading ? <Spinner /> :

                <section className={styles['all-books']}>
                    {bookByCategory.length === 0 && <h2 className={styles['no-books-found']}>В момента няма налични книги!</h2>}

                    {bookByCategory?.map(b => <BookItem key={b._id} book={b} />) || []}
                </section>
            }
        </>
    );
};

export default CategoryBooks;