import { Link } from 'react-router-dom';
import styles from './MyBooks.module.css';

const MyBook = ({ favourite }) => {


    return (
        <li className={styles['favourite-book']}>
            <div className={styles['book-img']}>
                <Link to={`/details/${favourite._id}`}>
                    <img src={favourite.imageUrl} alt="book" />
                </Link>
            </div>
            <div className={styles['content']}>
                <h3>{favourite.title}</h3>
                <h4>{favourite.author}</h4>
                <div className={styles['buttons']}>
                <button className={styles['delete']}>
                    <i className="fa-solid fa-trash-can"></i>
                    Изтрий
                </button>
                <Link to={`/edit/${favourite._id}`} className={styles['edit']}>
                    Редактирай
                </Link>
                </div>
            </div>
        </li>
    );
};

export default MyBook;