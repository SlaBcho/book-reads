import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as bookService from '../services/bookService';

export const SearchContext = createContext();

export const SearchProvider = ({
    children
}) => {
    const [searchedBook, setSearchedBook] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
    return (
        <SearchContext.Provider value={{
            isLoading,
            searchedBook,
            onSearchBook
        }}>
            {children}
        </SearchContext.Provider>);

};