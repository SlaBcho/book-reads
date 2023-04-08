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

    const onSearchBook = (e, query) => {
        e.preventDefault();

        setIsLoading(true);
        bookService.searchBook(query)
            .then(res => {
                setSearchedBook(res);
                setIsLoading(false);
            });
            navigate('/search');
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