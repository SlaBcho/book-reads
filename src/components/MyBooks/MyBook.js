import styles from './MyBooks.module.css';

import { Link } from 'react-router-dom';

const MyBook = ({ myBook, onBookDelete }) => {

    return (
        <li className={styles['favourite-book']}>
            <div className={styles['book-img']}>
                <Link to={`/details/${myBook._id}`}>
                    <img src={myBook.imageUrl} alt="book" />
                </Link>
            </div>
            <div className={styles['content']}>
                <h3>{myBook.title}</h3>
                <h4>{myBook.author}</h4>
                <div className={styles['buttons']}>
                    <button onClick={() => onBookDelete(myBook._id)} className={styles['delete']}>
                        <i className="fa-solid fa-trash-can"></i>
                        Изтрий
                    </button>
                    <Link to={`/edit/${myBook._id}`} className={styles['edit']}>
                        Редактирай
                    </Link>
                </div>
            </div>
        </li>
    );
};

export default MyBook;