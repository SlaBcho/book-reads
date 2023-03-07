import styles from './CreateBook.module.css';

import { useContext } from 'react';

import { BookContext } from '../../context/BookContext';

import * as bookService from '../../services/bookService';

const CreateBook = () => {

    const { addBookHandler } = useContext(BookContext);

    const onSubmit = (e) => {
        e.preventDefault();
        const gameData = Object.fromEntries(new FormData(e.target));

        bookService.create(gameData)
            .then(result => {
                addBookHandler(result);
                console.log(result._createdOn)
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
                        id="title" />
                </div>
                <div>
                    <label htmlFor="author">Автор</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="author"
                        id="author" />
                </div>
                <div>
                    <label htmlFor="category">Категория</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="category"
                        id="category" />
                </div>
                <div>
                    <label htmlFor="imageUrl">Снимка(линк)</label>
                    <input
                        className={styles['form-input']}
                        type="text"
                        name="imageUrl"
                        id="imageUrl" />
                </div>
                <div>
                    <label htmlFor="description">На кратко за книгата</label>
                    <textarea
                    rows={3}
                        className={styles['form-area']}
                        type="text"
                        name="description"
                        id="description" />
                </div>
                <div>
                    <label htmlFor="summary">Резюме</label>
                    <textarea
                        className={styles['form-area']}
                        rows={3}
                        type="text"
                        name="summary"
                        id="summary" />
                </div>
                <div>
                    <input className={styles['create-btn']} type="submit" value="Добави книгата" />
                </div>
            </form>
        </section>
    );
};

export default CreateBook;