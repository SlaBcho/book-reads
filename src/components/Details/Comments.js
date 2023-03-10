import styles from './Details.module.css';

const Comments = ({ book }) => {
    return (
        <>
        <ul className={styles['all-comments']}>
            <li className={styles['comment']}>
                <p className={styles['comment-content']}>Прекрасна книга!</p>
                <h4 className={styles['comment-author']}>{book._ownerId}</h4>
                <hr />
            </li >
            <li className={styles['comment']}>
                <p className={styles['comment-content']}>Прекрасна книга!</p>
                <h4 className={styles['comment-author']}>{book._ownerId}</h4>
                <hr />
            </li>
        </ul>

        <form className={styles['comments-form']}>
            <div className={styles['comments-title']}>
                <p>Вие оценявате:</p>
                <h2>{book.title}</h2>
            </div>

            <div className={styles['username']}>
                <label htmlFor="username">Псевдоним</label>
                <input type="text" id="username" name="username" />
            </div>
            <div className={styles['comment-text']}>
                <label htmlFor="comment">Коментар</label>
                <textarea type="text" id="comment" name="comment" rows={4}/>
            </div>

            <input className={styles['add-btn']} type="submit" value="Добави коментар" />
        </form>
        </>
    );
};

export default Comments;