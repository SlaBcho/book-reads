import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as bookService from '../services/bookService';

export const BookContext = createContext();

export const BookProvider = ({
    children
}) => {

    const [books, setBooks] = useState([]);
    const [favourite, setFavourite] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        bookService.getAll()
            .then(result => {
                setBooks(result);
            });
    }, []);

    const addToFavouriteHandler = (book) => {
        setFavourite(state => [...state, book]);
    };

    const removeFromFavouriteHandler = (id) => {
        setFavourite(state => state.filter(b => b._id !== id));
    };

    const addBookHandler = (bookData) => {
        setBooks(state => [
            ...state,
            bookData
        ]);

        navigate('/my-books');
    };

    const editBookHandler = (bookId, bookData) => {
        setBooks(state => state.map(x => x._id === bookId ? bookData : x));
    };

    const detelteBookHandler = (bookId) => {
        bookService.remove(bookId);
        setBooks(state => state.filter(b => b._id !== bookId));
    };

    const [searchedBook, setSearchedBook] = useState([]);

    const onSearchBook = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const bookName = data.get('search');
        bookService.searchBook(bookName)
            .then(res => {
                setSearchedBook(res);
            });
        navigate('/search');
    };

    return (
        <BookContext.Provider value={{
            books,
            favourite,
            searchedBook,
            addToFavouriteHandler,
            removeFromFavouriteHandler,
            addBookHandler,
            editBookHandler,
            detelteBookHandler,
            onSearchBook
        }}>
            {children}
        </BookContext.Provider>);

};