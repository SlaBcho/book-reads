import { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import BookItem from '../Main/Catalog/BookItem/BookItem';
import styles from './SearchBook.module.css';

const SearchBook = () => {
    const {searchedBook} = useContext(BookContext);

    return (
        <section className={styles['all-books']}>
            {searchedBook.map(b => <BookItem key={b._id} book={b} />)}
        </section>
    );
};

export default SearchBook;