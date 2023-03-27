import { useState } from 'react';
import { Link } from 'react-router-dom';

import ChoiceModal from '../Modal/ChoiceModal';

import styles from './MyBooks.module.css';

const MyBook = ({ myBook, onBookDelete }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    <button onClick={handleShow} className={styles['delete']}>
                        <i className="fa-solid fa-trash-can"></i>
                        Изтрий
                    </button>
                    <Link to={`/edit/${myBook._id}`} className={styles['edit']}>
                        <i className="fa-solid fa-pen"></i>
                        Редактирай
                    </Link>
                </div>
            </div>
            <ChoiceModal show={show} title={myBook.title} handleClose={handleClose} onRemoveFromFavourite={() => onBookDelete(myBook._id)} />
        </li>
    );
};

export default MyBook;