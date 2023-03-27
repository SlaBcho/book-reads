
import styles from './Books.module.css';

import { useContext} from 'react';
import { BookContext } from '../../../../context/BookContext';
import Spinner from '../../../Spinner/Spinner';
import BookItem from '../../../BookItem/BookItem';


const Books = ({criteria}) => {
    const { books, isLoading } = useContext(BookContext);
    
    return (
        <>
            {isLoading ? <Spinner /> :
                <section className={styles['catalog-items']}>
                    {  books?.sort((a,b) => b[criteria] - a[criteria]).slice(0,10).map(b => <BookItem key={b._id} book={b} />) || []}
                </section>
            }
        </>
    );
};

export default Books;