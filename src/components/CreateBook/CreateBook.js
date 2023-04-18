import { useContext } from 'react';

import * as bookService from '../../services/bookService';
import { BookContext } from '../../context/BookContext';

import { useForm } from '../../hooks/useForm';
import { useErrors } from '../../hooks/useErrors';

import styles from './CreateBook.module.css';
import { useState } from 'react';

const CreateBook = () => {
    const { addBookHandler } = useContext(BookContext);
    const [errors, setErrors] = useState({});
    const { error, errorMessage, onErrorHandler } = useErrors();
    const { formValues, onChangeHandler } = useForm({
        title: '',
        author: '',
        category: 'best-seller',
        imageUrl: '',
        description: '',
        summary: ''
    });


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
                    error = 'Description should be at least 20 symbols!';
                }
                break;
            case 'summary':
                if (value.trim().length < 30) {
                    error = 'Summary should be at least 20 symbols!';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (formValues.title === '' || formValues.author === '' || formValues.imageURl === '' || formValues.category === '' || formValues.description === '' || formValues.summary === '') {
            onErrorHandler('All fields are required!');
            return;
        }

        bookService.create(formValues)
            .then(result => {
                addBookHandler(result);
            })
            .catch((err) => {
                onErrorHandler(err.message);
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
                        value={formValues.author}
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
                        value={formValues.description}
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
                        value={formValues.summary}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.summary && <span className={styles['error-msg']}>{errors.summary}</span>}

                </div>
                {error && <span className={styles['error-msg']}>{errorMessage}</span>}
                <div>
                    <input className={styles['create-btn']} type="submit" value="Добави книгата" />
                </div>
            </form>
        </section>
    );
};

export default CreateBook;