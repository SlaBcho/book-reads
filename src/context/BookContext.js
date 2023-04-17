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
                }, 2000);
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
        const filterRating = bookRating.filter(r => r._id === book._id);

        let sum = rating;
        filterRating.forEach(r => sum += r.rating);
        if (filterRating.length > 0) {
            sum = sum / (filterRating.length + 1).toFixed(2);
        } else {
            sum = rating;
        };

        setBooks(state => state.map(b => b._id === book._id ? ({ ...b, rating: sum, commentId: result._id }) : b));
    };

    const onRemoveRating = (commentDd, bookId) => {
        setBookRating(state => state.filter(b => b.commentId !== commentDd));
        const filterRating = bookRating.filter(r => r.commentId !== commentDd);
        
        let sum = 0;
        
        filterRating.forEach(r => sum += r.rating);

        if (filterRating.length > 0) {
            sum = sum / (filterRating.length - 1).toFixed(2);
        } else {
            sum = 0;
        };
        setBooks(state => state.map(b=> b._id === bookId ? ({...b, rating:sum}): b));
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