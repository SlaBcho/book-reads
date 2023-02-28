import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import * as bookService from './services/bookService';
import { useLocalStorage } from './hooks/useLocalStorage';
// import { AuthContext } from './context/AuthContext';
import { BookContext } from './context/BookContext';
import { AuthContext } from './context/AuthContext';

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

function App() {
	const [books, setBooks] = useState([]);
	const [bookByCategory, setBooksByCategory] = useState([]);
	const [auth, setAuth] = useLocalStorage('auth', {});
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
				console.log(res);
			});
	}, [category]);

	const userLogin = (authData) => {
		setAuth(authData);
	};

	const userLogout = () => {
		setAuth({});
	};

	const addToFavouriteHandler = (book) => {
		setFavourite(state => [...state, book]);
	};

	const removeFromFavouriteHandler = (id) => {
		setFavourite(state => state.filter(b => b._id !== id));

	};

	return (
		<AuthContext.Provider value={{ user: auth, userLogin, userLogout }}>

			<div className="wrapper">
				<Header />
				<BookContext.Provider value={{books, bookByCategory, addToFavouriteHandler, removeFromFavouriteHandler, favourite}}>
					<main>
						<Routes>
							<Route path={'/'} element={<Main />} />
							<Route path={'/login'} element={<Login />} />
							<Route path={'/register'} element={<Register />} />
							<Route path={'/logout'} element={<Logout />} />
							<Route path={'/details/:bookId'} element={<Details />} />
							<Route path={'/favourites'} element={<Favourites />} />

							<Route path={'/all-books'} element={<AllBooks />} />
							<Route path={'/best-seller'} element={<CategoryBooks />} />
							<Route path={'/fantasy'} element={<CategoryBooks />} />
							<Route path={'/all-books'} element={<CategoryBooks />} />
							<Route path={'/iconomic-and-business'} element={<CategoryBooks />} />
							<Route path={'/psychology'} element={<CategoryBooks />} />
							<Route path={'/autobiography'} element={<CategoryBooks />} />
							<Route path={'/psychology'} element={<CategoryBooks />} />

						</Routes>
					</main>
				</BookContext.Provider>
				<Footer />
			</div >
		</AuthContext.Provider>
	);
}

export default App;
