import styles from './CreateBook.module.css';

import { useContext, useState } from 'react';
import { BookContext } from '../../context/BookContext';
import * as bookService from '../../services/bookService';

const CreateBook = () => {

    const { addBookHandler } = useContext(BookContext);

     const [bookData, setBookData] = useState({
        title:'',
        author:'',
        category:'',
        imageUrl:'',
        description:'',
        summary:''
    });

    const onChangeHandler = (e) => {
        setBookData(state => ({...state, [e.target.name]:e.target.value}));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        bookService.create(bookData)
            .then(result => {
                addBookHandler(result);
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

export default CreateBook;