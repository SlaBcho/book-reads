import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { BookContext } from '../../context/BookContext';

import * as commentService from '../../services/commentService';

import ChoiceModal from '../Modal/ChoiceModal';
import styles from './Details.module.css';


const Comment = ({ comment, setComments }) => {
    const { user } = useContext(AuthContext);
    const { onRemoveRating } = useContext(BookContext);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onDeleteComment = () => {
        commentService.removeCommment(comment._id);
        setComments(state => state.filter(c => c._id !== comment._id));
        onRemoveRating(comment._id);
    };

    return (
        <li key={comment._id} className={styles['comment']}>
            {user._id === comment._ownerId ? (
                <button onClick={handleShow} className={styles['delete']}>x</button>
            ) : null}
            <h3>Рейтинг: {comment.rating} (5)</h3>
            <h4 className={styles['comment-author']}><span>Пвсевдоним:</span> {comment.username}</h4>
            <p className={styles['comment-content']}><span>Коментар:</span> {comment.comment}</p>
            <hr />
            <ChoiceModal show={show} handleClose={handleClose} onRemoveFromFavourite={onDeleteComment} />
        </li >
    );
};

export default Comment;