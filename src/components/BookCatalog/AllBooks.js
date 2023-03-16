import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import BookItem from '../BookItem/BookItem';

import Spinner from '../Spinner/Spinner';
import styles from './AllBooks.module.css';

const AllBooks = () => {

    const { books, isLoading } = useContext(BookContext);

    return (
        <>
            {isLoading ? <Spinner /> :
                <section className={styles['all-books']}>
                    {books?.map(b => <BookItem key={b._id} book={b} />) || []}
                </section>
            }
        </>
    );
};

export default AllBooks;