import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Logout from './components/Logout/Logout';
import AllBooks from './components/BookCatalog/AllBooks';
import CategoryBooks from './components/BookCatalog/CategoryBooks';
import Details from './components/Details/Details';
import Favourites from './components/Favourites/Favourites';
import Footer from './components/Footer/Footer';
import MyBooks from './components/MyBooks/MyBooks';
import CreateBook from './components/CreateBook/CreateBook';
import Edit from './components/Edit/Edit';
import SearchBook from './components/SearchBook/SearchBook';
import Home from './components/Home/Home';
import { RouteGuard } from './components/common/RouteGuard';
import { IsPublicRouteGuard } from './components/common/IsPublicRouteGuard';
import BookOwner from './components/common/BookOwner';
import { FavouriteBookProvider } from './context/FavouriteBooksContext';

function App() {

	return (
		<AuthProvider>
			<BookProvider>
				<FavouriteBookProvider>
					<div className="wrapper">
						<Header />
						<main>
							<Routes>
								<Route path={'/'} element={<Home />} />
								<Route path={'/search'} element={<SearchBook />} />
								<Route path={'/details/:bookId'} element={<Details />} />

								<Route element={<IsPublicRouteGuard />}>
									<Route path={'/login'} element={<Login />} />
									<Route path={'/register'} element={<Register />} />
								</Route>

								<Route element={<RouteGuard />}>
									<Route path={'/logout'} element={<Logout />} />
									<Route path={'/create'} element={<CreateBook />} />

									<Route path={'/edit/:bookId'} element={
										<BookOwner>
											<Edit />
										</BookOwner>
									} />
								</Route>

								<Route path={'/favourites'} element={<Favourites />} />
								<Route path={'/my-books'} element={<MyBooks />} />

								<Route path={'/all-books'} element={<AllBooks />} />
								<Route path={'/:category'} element={<CategoryBooks />} />
							</Routes>
						</main>
						<Footer />
					</div >
				</FavouriteBookProvider>
			</BookProvider>
		</AuthProvider>
	);
}

export default App;
