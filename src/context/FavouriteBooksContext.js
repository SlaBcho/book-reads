import { createContext, useState } from 'react';

export const FavouriteBookContext = createContext();

export const FavouriteBookProvider = ({
    children
}) => {

    const [favourite, setFavourite] = useState([]);
 

    const addToFavouriteHandler = (book) => {
        setFavourite(state => [...state, book]);
    };

    const removeFromFavouriteHandler = (id) => {
        setFavourite(state => state.filter(b => b._id !== id));
    };


    return (
        <FavouriteBookContext.Provider value={{
            favourite,
            addToFavouriteHandler,
            removeFromFavouriteHandler,
        }}>
            {children}
        </FavouriteBookContext.Provider>);

};