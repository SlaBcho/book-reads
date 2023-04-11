import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as bookService from '../services/bookService';

export const BookContext = createContext();

export const BookProvider = ({
    children
}) => {

    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bookRating, setBookRating] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        bookService.getAll()
            .then(result => {
                setBooks(result);
                setIsLoading(false);
            })
            .catch((err) => {
                setTimeout(() => {
                    setIsLoading(false);
                    setBooks([]);
                }, 200);
            });
    }, []);

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
        setBooks(state => state.filter(b => b._id !== bookId));
    };


    const onAddBookRating = (book, rating, result) => {
        setBookRating(state => [...state, book]);
        setBooks(state => state.map(b => b._id === book._id ? ({ ...b, rating: rating, commentId: result._id }) : b));
    };

    const onRemoveRating = (id) => {
        setBookRating(state => state.filter(b => b.commentId !== id));
    };

    return (
        <BookContext.Provider value={{
            books,
            isLoading,
            bookRating,
            addBookHandler,
            editBookHandler,
            detelteBookHandler,
            onAddBookRating,
            onRemoveRating,
        }}>
            {children}
        </BookContext.Provider>);

};