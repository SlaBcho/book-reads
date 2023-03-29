import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as bookService from '../services/bookService';

export const BookContext = createContext();

export const BookProvider = ({
    children
}) => {

    const [books, setBooks] = useState([]);
    const [favourite, setFavourite] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchedBook, setSearchedBook] = useState([]);
    const [bookRating, setBookRating] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        bookService.getAll()
            .then(result => {
                setBooks(result);
                setIsLoading(false);
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

    const detelteBookHandler = async (bookId) => {
        await bookService.remove(bookId);
        setBooks(state => state.filter(b => b._id !== bookId));
    };

    const onSearchBook = (e, search) => {
        e.preventDefault();
        
        const bookName = search.search;
        
        setIsLoading(true);
        bookService.searchBook(bookName)
            .then(res => {
                setSearchedBook(res);
                setIsLoading(false);
            });
        navigate('/search');
        e.target.reset();
    };

    const onAddBookRating = (book, rating, result) => {
        setBookRating(state => [...state, book]);
        setBooks(state => state.map(b => b._id === book._id ? ({...b, rating: rating, commentId:result._id}) : b));
    };

    const onRemoveRating = (id) => {
        setBookRating(state => state.filter(b => b.commentId !== id));
    };

    return (
        <BookContext.Provider value={{
            books,
            favourite,
            searchedBook,
            isLoading,
            bookRating,
            addToFavouriteHandler,
            removeFromFavouriteHandler,
            addBookHandler,
            editBookHandler,
            detelteBookHandler,
            onSearchBook,
            onAddBookRating,
            onRemoveRating
        }}>
            {children}
        </BookContext.Provider>);

};