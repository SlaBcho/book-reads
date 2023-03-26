import { useState, useEffect, useContext } from 'react';

import * as bookService from '../../services/bookService';
import * as commentService from '../../services/commentService';

import { AuthContext } from '../../context/AuthContext';
import { BookContext } from '../../context/BookContext';
import { useForm } from '../../hooks/useForm';
import { errors } from '../../util/error';

import Rating from '../BookItem/Rating';
import Comment from './Comment';
import styles from './Details.module.css';

const Comments = ({ book }) => {
    const { user } = useContext(AuthContext);
    const { onAddBookRating } = useContext(BookContext);
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [hasComment, setHasComment] = useState(0);

    const { formValues, onChangeHandler } = useForm({
        username: '',
        comment: ''
    });

    useEffect(() => {
        commentService.getCommentById(book._id)
            .then(res => {
                setComments(res);
            });
    }, [book]);

    useEffect(() => {
        commentService.getMyCommentsByBookId(book._id, user._id)
            .then(res => {
                setHasComment(res);
            });
    },[book, user]);

    const onRatingChange = (value) => {
        setRating(value);
    };   
    
    const onAddComment = async (e) => {
        e.preventDefault();
        const { username, comment } = formValues;

        const result = await commentService.postComment(book._id, comment, username, rating);

        if (comment === '' || username === '') {
            errors(setError, setErrorMsg, 'All fileds are required');
            return;
        }

        setComments(state => [...state, result]);
        formValues.username = '';
        formValues.comment = '';
        setHasComment(1);
        onAddBookRating({ ...book, rating: rating }, rating);
    };

    const isShowForm = user.email && (user._id !== book._ownerId) && hasComment < 1;

    return (
        <>
            <ul className={styles['all-comments']}>
                {!user.email ? <p>Моля влезте в своя акаунт, за да добавите коментар за книгата!</p> : null}
                {user.email && comments.length === 0 ? <p>Бъдете първия оценил тази книга!</p> : null}
                {comments.map(c => <Comment key={c._id} comment={c} setComments={setComments} />)}
            </ul>

            {isShowForm && (
                <form onSubmit={onAddComment} className={styles['comments-form']}>
                    <div className={styles['comments-title']}>
                        <p>Вие оценявате:</p>
                        <h2>{book.title}</h2>
                    </div>
                    <Rating onRatingChange={onRatingChange} />

                    <div className={styles['username']}>
                        <label htmlFor="username">Псевдоним</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formValues.username}
                            onChange={onChangeHandler}
                        />
                    </div>
                    <div className={styles['comment-text']}>
                        <label htmlFor="comment">Коментар</label>
                        <textarea
                            type="text"
                            id="comment"
                            name="comment"
                            rows={4}
                            value={formValues.comment}
                            onChange={onChangeHandler} />
                    </div>
                    {error ? <p className={styles['error-msg']}>{errorMsg}</p> : null}
                    <input className={styles['add-btn']} type="submit" value="Добави коментар" />
                </form>
            )}

        </>
    );
};

export default Comments;