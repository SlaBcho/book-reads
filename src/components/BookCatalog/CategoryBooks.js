import { useContext} from 'react';
import styles from './AllBooks.module.css';
import { useLocation } from 'react-router-dom';
import BookItem from '../BookItem/BookItem';
import { BookContext } from '../../context/BookContext';


const CategoryBooks = () => {
    const location = useLocation();
    const category = location.pathname.slice(1);
    const { books } = useContext(BookContext);
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