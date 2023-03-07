import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import * as bookService from './services/bookService';

import { BookContext } from './context/BookContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Logout from './components/Logout/Logout';
import AllBooks from './components/BookCatalog/AllBooks';
import CategoryBooks from './components/BookCatalog/CategoryBooks';
import Main from './components/Main/Main';
import Details from './components/Details/Details';
import Favourites from './components/Favourites/Favourites';
import Footer from './components/Footer/Footer';
import MyBooks from './components/MyBooks/MyBooks';

function App() {
	const [books, setBooks] = useState([]);
	const [bookByCategory, setBooksByCategory] = useState([]);
	const [favourite, setFavourite] = useState([]);
	
	const location = useLocation();
	const category = location.pathname.slice(1);

	useEffect(() => {
		bookService.getAll()
			.then(result => {
				setBooks(result);
			});
	}, []);

	useEffect(() => {
		bookService.getByCategory(category)
			.then(res => {
				setBooksByCategory(res);
			});
	}, [category]);

	const addToFavouriteHandler = (book) => {
		setFavourite(state => [...state, book]);
	};

	const removeFromFavouriteHandler = (id) => {
		setFavourite(state => state.filter(b => b._id !== id));
	};

	return (
		<AuthProvider>
			<div className="wrapper">
				<Header />
				<BookContext.Provider value={{ books, bookByCategory, addToFavouriteHandler, removeFromFavouriteHandler, favourite }}>
					<main>
						<Routes>
							<Route path={'/'} element={<Main />} />
							<Route path={'/login'} element={<Login />} />
							<Route path={'/register'} element={<Register />} />
							<Route path={'/logout'} element={<Logout />} />
							<Route path={'/details/:bookId'} element={<Details />} />
							<Route path={'/favourites'} element={<Favourites />} />
							<Route path={'/my-books'} element={<MyBooks />} />

							<Route path={'/all-books'} element={<AllBooks />} />
							<Route path={'/best-seller'} element={<CategoryBooks />} />
							<Route path={'/fantasy'} element={<CategoryBooks />} />
							<Route path={'/fiction'} element={<CategoryBooks />} />
							<Route path={'/history-and-politics'} element={<CategoryBooks />} />
							<Route path={'/psychology'} element={<CategoryBooks />} />
							<Route path={'/autobiography'} element={<CategoryBooks />} />
							<Route path={'/kids-book'} element={<CategoryBooks />} />
						</Routes>
					</main>
				</BookContext.Provider>
				<Footer />
			</div >
		</AuthProvider>
	);
}

export default App;
