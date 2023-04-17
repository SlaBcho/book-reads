import { useState, useEffect, useContext } from 'react';

import * as commentService from '../../services/commentService';

import { AuthContext } from '../../context/AuthContext';
import { BookContext } from '../../context/BookContext';
import { useForm } from '../../hooks/useForm';
import { useErrors } from '../../hooks/useErrors';

import Rating from '../BookItem/Rating';
import Comment from './Comment';
import styles from './Details.module.css';
import { ProfileContext } from '../../context/ProfileContext';

const Comments = ({ book }) => {
    const { user } = useContext(AuthContext);
    const { onAddBookRating } = useContext(BookContext);
    const { profileInfo, allProfiles } = useContext(ProfileContext);

    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState([]);
    const [hasComment, setHasComment] = useState(0);
    const [errors, setErrors] = useState({});
    const { error, errorMessage, onErrorHandler } = useErrors();

    const { formValues, onChangeHandler } = useForm({
        username: profileInfo ? profileInfo.username : '',
        comment: ''
    });

    useEffect(() => {
        Promise.all([
            commentService.getCommentById(book._id),
            commentService.getMyCommentsByBookId(book._id, user._id)
        ])
            .then(res => {
                const [comment, hasComment] = res;
                setComments(comment);
                setHasComment(hasComment);
            });
    }, [book, user]);

    const onRatingChange = (value) => {
        setRating(value);
    };

    const onBlurHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let error = null;

        switch (name) {
            case 'username':
                if (value.trim().length < 2) {
                    error = 'Username can`t be less than 2 symbols!';
                } else if (allProfiles !== undefined && allProfiles.find(el => el.username === value && el._ownerId !== user._id)) {
                    error = 'This username already exist!';
                };
                break;
            case 'comment':
                if (value.trim().length < 10) {
                    error = 'Comment can`t be less than 10 symbols!';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onAddComment = async (e) => {
        e.preventDefault();
        const { username, comment } = formValues;

        if(errors.username || errors.comment) {
            return;
        }

        if (comment === '' || username === '') {
            onErrorHandler('All fileds are required!');
            return;
        }

        const result = await commentService.postComment(book._id, comment, username, rating);

        setComments(state => [...state, result]);
        formValues.username = '';
        formValues.comment = '';
        setHasComment(1);
        onAddBookRating({ ...book, rating: rating, commentId: result._id }, rating, result);
    };

    const isShowForm = user.email && (user._id !== book._ownerId) && hasComment < 1;

    return (
        <>
            <ul className={styles['all-comments']}>
                {!user.email ? <p>Моля влезте в своя акаунт, за да добавите коментар за книгата!</p> : null}
                {user.email && comments.length === 0 && user._id !== book._ownerId ? <p>Бъдете първия оценил тази книга!</p> : null}
                {comments.map(c => <Comment key={c._id} comment={c} setComments={setComments} />)}
                {user._id === book._ownerId && comments.length === 0 && <p>Вие сте добавили тази книга и не може да добавите мнение!</p>}
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
                            onBlur={onBlurHandler}
                        />
                        {errors.username && <span className={styles['error-msg']}>{errors.username}</span>}

                    </div>
                    <div className={styles['comment-text']}>
                        <label htmlFor="comment">Коментар</label>
                        <textarea
                            type="text"
                            id="comment"
                            name="comment"
                            rows={4}
                            value={formValues.comment}
                            onChange={onChangeHandler}
                            onBlur={onBlurHandler}
                        />
                        {errors.comment && <span className={styles['error-msg']}>{errors.comment}</span>}

                    </div>
                    {error && <span className={styles['error-msg']}>{errorMessage}</span>}

                    <input className={styles['add-btn']} type="submit" value="Добави коментар" />
                </form>
            )}

        </>
    );
};

export default Comments;