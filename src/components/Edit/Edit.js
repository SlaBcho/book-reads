import { useContext, useEffect, useState } from 'react';
import styles from './Edit.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { BookContext } from '../../context/BookContext';

import * as bookService from '../../services/bookService';

const Edit = () => {
    const navigate = useNavigate();
    const [bookData, setBookData] = useState({});
    const { editBookHandler } = useContext(BookContext);
    const { bookId } = useParams();

    useEffect(() => {
        bookService.getById(bookId)
            .then(result => {
                setBookData(result);
            });
    }, [bookId]);

    const onChangeHandler = (e) => {
        setBookData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        bookService.edit(bookId, bookData)
            .then(result => {
                editBookHandler(result);
                navigate(`/details/${bookId}`);
            });
    };

    return (
        <section className={styles['create-section']}>
            <form onSubmit={onSubmit} className={styles['create-form']}>
                <h2>Добавете вашата книга</h2>
                <div >
                    <label htmlFor="title">Заглавие</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="title"
                        id="title"
                        value={bookData.title}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <label htmlFor="author">Автор</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="author"
                        id="author"
                        value={bookData.author}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <label htmlFor="category">Категория</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="category"
                        id="category"
                        value={bookData.category}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <label htmlFor="imageUrl">Снимка(линк)</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        value={bookData.imageUrl}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <label htmlFor="description">На кратко за книгата</label>
                    <textarea
                        rows={3}
                        className={styles['form-area']}
                        type="text"
                        name="description"
                        id="description"
                        value={bookData.description}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <label htmlFor="summary">Резюме</label>
                    <textarea
                        className={styles['form-area']}
                        rows={3}
                        type="text"
                        name="summary"
                        id="summary"
                        value={bookData.summary}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <input className={styles['create-btn']} type="submit" value="Добави книгата" />
                </div>
            </form>
        </section>
    );
};

export default Edit;