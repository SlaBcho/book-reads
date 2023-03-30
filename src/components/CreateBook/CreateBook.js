import { useContext, useState } from 'react';

import { BookContext } from '../../context/BookContext';
import * as bookService from '../../services/bookService';
import { useForm } from '../../hooks/useForm';
import { errors } from '../../util/error';

import styles from './CreateBook.module.css';

const CreateBook = () => {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { addBookHandler } = useContext(BookContext);

    const { formValues, onChangeHandler } = useForm({
        title: '',
        author: '',
        category: 'best-seller',
        description: '',
        summary: ''
    });

    const [photo, setphoto] = useState(null);
    
    const handleInputChange = (event) => {
        setphoto(URL.createObjectURL(event.target.files[0]));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        bookService.create({ ...formValues, imageUrl: photo })
            .then(result => {
                addBookHandler(result);
            });

        if (formValues.title === '' || formValues.author === '' || formValues.imageURl === '' || formValues.category === '' || formValues.description === '' || formValues.summary === '') {
            errors(setError, setErrorMsg, 'All fields are required!');
        }
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
                    {/* <label htmlFor="imageUrl">Снимка(линк)</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        value={formValues.imageUrl}
                        onChange={onChangeHandler}
                    /> */}
                    <label htmlFor="imageUrl">Снимка(линк)</label>
                    <input
                        name="imageUrl"
                        accept="image/*"
                        type="file"
                        value={formValues.imageUrl}
                        onChange={handleInputChange}
                    />
                    <img style={{ height: "200px", width: "200px" }} src={photo} alt='img' />
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
                    {error && <p className={styles['error-msg']}>{errorMsg}</p>}
                    <input className={styles['create-btn']} type="submit" value="Добави книгата" />
                </div>
            </form>
        </section>
    );
};

export default CreateBook;