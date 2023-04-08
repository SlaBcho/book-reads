import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as bookService from '../../services/bookService';
import { BookContext } from '../../context/BookContext';

import styles from './Edit.module.css';
import { useForm } from '../../hooks/useForm';
import { useErrors } from '../../hooks/useErrors';

const Edit = () => {
    const navigate = useNavigate();
    const { editBookHandler } = useContext(BookContext);
    const { bookId } = useParams();

    const { formValues, onChangeHandler, changeValues } = useForm({
        title: '',
        author: '',
        category: 'best-seller',
        imageUrl: '',
        description: '',
        summary: ''
    });

    useEffect(() => {
        bookService.getById(bookId)
            .then(result => {
                changeValues(result);
            });
    }, [bookId, changeValues]);

    const { error, errorMessage, onErrorHandler } = useErrors();

    const onSubmit = (e) => {
        e.preventDefault();
        if (formValues.title === '' || formValues.author === '' || formValues.imageURl === '' || formValues.category === '' || formValues.description === '' || formValues.summary === '') {
            onErrorHandler('All fields are required!');
            return;
        }
        bookService.edit(bookId, formValues)
            .then(result => {
                editBookHandler(bookId, result);
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
                        value={formValues.title}
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
                        value={formValues.author}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    <label htmlFor="category">Категория</label>
                    <select
                        className={styles['form-input']}
                        type="text"
                        name="category"
                        id="category"
                        value={formValues.category}
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
                        value={formValues.imageUrl}
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
                        value={formValues.description}
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
                        value={formValues.summary}
                        onChange={onChangeHandler}
                    />
                </div>
                <div>
                    {error && <p className={styles['error-msg']}>{errorMessage}</p>}

                    <input className={styles['create-btn']} type="submit" value="Добави книгата" />
                </div>
            </form>
        </section>
    );
};

export default Edit;