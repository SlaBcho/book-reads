import  BookItem  from '../BookItem/BookItem';

import styles from './Books.module.css';

const Books = ({ books }) => {

    return (
        <section className={styles['catalog-items']}>
            <BookItem />
            <BookItem />
            <BookItem />
            <BookItem />
            <BookItem />
        </section>
    );
};

export default Books;