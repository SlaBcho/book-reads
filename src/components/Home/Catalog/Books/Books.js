
import styles from './Books.module.css';

import { useContext, useEffect, useState } from 'react';
import { BookContext } from '../../../../context/BookContext';
import Spinner from '../../../Spinner/Spinner';
import BookItem from '../../../BookItem/BookItem';


const Books = () => {
    const { books, isLoading } = useContext(BookContext);
    const [filtered, setFiltered] = useState(books);
    
    useEffect(() => {
            setFiltered(state => state.sort((a,b) => (b.rating) - (a.rating))); 
    },[books, filtered]);
    return (
        <>
            {isLoading ? <Spinner /> :
                <section className={styles['catalog-items']}>
                    {filtered?.map(b => <BookItem key={b._id} book={b} />) || []}
                </section>
            }
        </>
    );
};

export default Books;