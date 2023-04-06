import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';

import BookItem from '../BookItem/BookItem';
import Spinner from '../Spinner/Spinner';
import styles from './SearchBook.module.css';

const SearchBook = () => {
    const { searchedBook, isLoading } = useContext(SearchContext);

    return (
        <>
            {isLoading ? <Spinner /> :
                <section className={styles['all-books']}>
                    {searchedBook.length === 0 && <h2 className={styles['no-books-found']}>Няма намерени книги с това име!</h2>}
                    {searchedBook.map(b => <BookItem key={b._id} book={b} />)}
                </section>
            }
        </>
    );
};

export default SearchBook;