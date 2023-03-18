import styles from './Details.module.css';

import { useState, useEffect, useContext } from 'react';

import * as bookService from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';
import Rating from '../BookItem/Rating';
import Comment from './Comment';


const Comments = ({ book }) => {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);

    const [comments, setComments] = useState([]);
    const [commentData, setCommentData] = useState({
        username: '',
        comment: '',
    });

    const isShowForm = user.email && (user._id !== book._ownerId);

    useEffect(() => {
        bookService.getCommentById(book._id)
            .then(res => {
                setComments(res);
            });
    }, [book]);

    const onChangeHandler = (e) => {
        setCommentData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onRatingChange = (value) => {
        setRating(value);
    };

    const onAddComment = async (e) => {
        e.preventDefault();
        const { username, comment } = commentData;

        if (comment === '' || username === '') {
            return;
        }

        const result = await bookService.postComment(book._id, comment, username, rating);
        setComments(state => [...state, result]);
        setCommentData({
            username: '',
            comment: '',
        });
        console.log(comments);
    };

    return (
        <>
            <ul className={styles['all-comments']}>
                {!user.email ? <p>Моля влезте в своя акаунт, за да добавите коментар за книгата!</p> : null}
                {user.email && comments.length === 0 ? <p>Бъдете първия оценил тази книга!</p> : null}
                {comments.map(c => <Comment key={c._id} comment ={c} setComments={setComments}/>)}
            </ul>

            {isShowForm && (
                <form onSubmit={onAddComment} className={styles['comments-form']}>
                    <div className={styles['comments-title']}>
                        <p>Вие оценявате:</p>
                        <h2>{book.title}</h2>
                    </div>
                    <Rating rating={commentData.rating} onRatingChange={onRatingChange} />

                    <div className={styles['username']}>
                        <label htmlFor="username">Псевдоним</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={commentData.username}
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
                            value={commentData.comment}
                            onChange={onChangeHandler} />
                    </div>

                    <input className={styles['add-btn']} type="submit" value="Добави коментар" />
                </form>
            )}

        </>
    );
};

export default Comments;