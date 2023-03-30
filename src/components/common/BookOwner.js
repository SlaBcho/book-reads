import { useContext } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookContext } from '../../context/BookContext';

const BookOwner = ({ children }) => {
    const { bookId } = useParams();
    const { books } = useContext(BookContext);
    const { user } = useContext(AuthContext);

    const currentBook = books.find(book => book._id === bookId);

    if (currentBook && currentBook._ownerId !== user._id) {
        return <Navigate to={`/details/${bookId}`} />;
    }

    return children ? children : <Outlet />;
};

export default BookOwner;