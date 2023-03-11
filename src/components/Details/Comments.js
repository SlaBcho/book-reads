import { useState, useEffect, useContext } from 'react';
import styles from './Details.module.css';

import * as bookService from '../../services/bookService';

import { AuthContext } from '../../context/AuthContext';

const Comments = ({ book, setSummaryView, setCommentView }) => {

    const [comments, setComments] = useState([]);
    const [commentData, setCommentData] = useState({
        username: '',
        comment: ''
    });

    const { user } = useContext(AuthContext);
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

    const onAddComment = (e) => {
        e.preventDefault();
        const { username, comment } = commentData;

        if (comment === '' || username === '') {
            return;
        } 
            bookService.postComment(book._id, comment, username);
            setCommentData({
                username: '',
                comment: ''
            });
            setSummaryView({isActive:true});
            setCommentView({isActive:false});        
    };

    return (
        <>
            <ul className={styles['all-comments']}>
                {comments.length === 0 ? <p>Бъдете първия оценил тази книга!</p> : null}
                {comments.map(c => (
                    <li key={c._id} className={styles['comment']}>
                        <h4 className={styles['comment-author']}><span>Пвсевдоним:</span> {c.username}</h4>
                        <p className={styles['comment-content']}><span>Коментар:</span> {c.comment}</p>
                        <hr />
                    </li >
                ))}
            </ul>

            {isShowForm && (
                <form onSubmit={onAddComment} className={styles['comments-form']}>
                    <div className={styles['comments-title']}>
                        <p>Вие оценявате:</p>
                        <h2>{book.title}</h2>
                    </div>

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