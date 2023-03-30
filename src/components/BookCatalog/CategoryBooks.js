import { useContext} from 'react';
import styles from './AllBooks.module.css';
import { useParams } from 'react-router-dom';
import BookItem from '../BookItem/BookItem';
import { BookContext } from '../../context/BookContext';


const CategoryBooks = () => {
    const {category} = useParams();
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