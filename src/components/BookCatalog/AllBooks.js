import { useContext, useState } from 'react';
import { BookContext } from '../../context/BookContext';
import BookItem from '../BookItem/BookItem';

import * as bookService from '../../services/bookService';

import Spinner from '../Spinner/Spinner';
import styles from './AllBooks.module.css';
import Pagination from '../Pagination/Pagination';

const AllBooks = () => {

    const { books, isLoading } = useContext(BookContext);
    const [page, setPage] = useState(1);

    const [booksPerPage, setBooksPerPage] = useState(books.slice(0,12));

    const onChangeHandler = async (page) => {
        let skip = (page-1)*12;
        const result = await bookService.pagination(skip);
        setBooksPerPage(result);
        setPage(page);
    };

    return (
        <>
            {isLoading ? <Spinner /> :
                <section className={styles['all-books']}>
                    {booksPerPage?.map(b => <BookItem key={b._id} book={b} />) || []}
                </section>
            }
            <Pagination onChangeHandler={onChangeHandler} page={page} totalItems={books.length}/>
        </>
    );
};

export default AllBooks;