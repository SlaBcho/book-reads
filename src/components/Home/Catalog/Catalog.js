import styles from './Catalog.module.css';
import Books from './Books/Books';

const Catalog = () => {

    return (
        <section className={styles['catalog']}>
            <h2 className={styles['articles-name']}>Най-нови книги</h2>
            <Books criteria="_createdOn"/>
            
            <h2 className={styles['articles-name']}>Книги с най-висок рейтинг</h2>
            <Books criteria="rating"/>
            {/* <h2 className={styles['articles-name']}>Най-четени книги</h2>
            <Books criteria='rating'/> */}
            {/* <h2 className={styles['articles-name']}>Най-коментирани</h2>
            <Books criteria='_createdOn'/> */}
        </section>
    );
};

export default Catalog;