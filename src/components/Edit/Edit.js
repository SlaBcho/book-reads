import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as bookService from '../../services/bookService';
import { BookContext } from '../../context/BookContext';

import styles from './Edit.module.css';
import { useErrors } from '../../hooks/useErrors';
import { useState } from 'react';

const Edit = () => {
    const navigate = useNavigate();
    const { editBookHandler } = useContext(BookContext);
    const { bookId } = useParams();
    const [bookData, setBookData] = useState({});
    const [errors, setErrors] = useState({});
    const { error, errorMessage, onErrorHandler } = useErrors();

    useEffect(() => {
        bookService.getById(bookId)
            .then(result => {
                setBookData(result);
            });
    }, [bookId]);

    const onChangeHandler = (e) => {
        setBookData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onBlurHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let error = null;

        switch (name) {
            case 'title':
                if (value.trim().length < 2) {
                    error = 'Title should be at least 2 symbols!';
                }
                break;
            case 'author':
                if (value.trim().length < 2) {
                    error = 'Author should be at least 2 symbols!!';
                }
                break;
            case 'imageUrl':
                if (value.trim().length < 10) {
                    error = 'ImageUrl should be at lest 10 symbols';
                }
                break;
            case 'description':
                if (value.trim().length < 30) {
                    error = 'Description should be at least 30 symbols!';
                }
                break;
            case 'summary':
                if (value.trim().length < 30) {
                    error = 'Summary should be at least 30 symbols!';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (bookData.title === '' || bookData.author === '' || bookData.imageURl === '' || bookData.category === '' || bookData.description === '' || bookData.summary === '') {
            onErrorHandler('All fields are required!');
            return;
        }
        bookService.edit(bookId, bookData)
            .then(result => {
                editBookHandler(bookId, result);
                navigate(`/details/${bookId}`);
            });
    };
    return (
        <section className={styles['create-section']}>
            <form onSubmit={onSubmit} className={styles['create-form']}>
                <h2>Редактирайте вашата книга</h2>
                <div >
                    <label htmlFor="title">Заглавие</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="title"
                        id="title"
                        value={bookData.title}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                {errors.title && <span className={styles['error-msg']}>{errors.title}</span>}

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
                        onBlur={onBlurHandler}
                    />
                {errors.author && <span className={styles['error-msg']}>{errors.author}</span>}

                </div>
                <div>
                    <label htmlFor="category">Категория</label>
                    <select
                        className={styles['form-input']}
                        type="text"
                        name="category"
                        id="category"
                        value={bookData.category}
                        onChange={onChangeHandler}
                    >
                        <option value="best-seller">best-seller</option>
                        <option value="fantasy">fantasy</option>
                        <option value="fiction">fiction</option>
                        <option value="history-and-politics">history-and-politics</option>
                        <option value="psychology">psychology</option>
                        <option value="autobiography">autobiography</option>
                        <option value="kids-book">kids-book</option>

                    </select>
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
                        onBlur={onBlurHandler}
                    />
                {errors.imageUrl && <span className={styles['error-msg']}>{errors.imageUrl}</span>}

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
                        onBlur={onBlurHandler}
                    />
                {errors.description && <span className={styles['error-msg']}>{errors.description}</span>}

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
                        onBlur={onBlurHandler}
                    />
                {errors.summary && <span className={styles['error-msg']}>{errors.summary}</span>}

                </div>
                <div>
                    {error && <span className={styles['error-msg']}>{errorMessage}</span>}

                    <input className={styles['create-btn']} type="submit" value="Редактирай книгата" />
                </div>
            </form>
        </section>
    );
};

export default Edit;