import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import * as bookService from './services/bookService';
// import { AuthContext } from './context/AuthContext';
import { BookContext } from './context/BookContext';

import Header from './components/Header/Header';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';

import Main from './components/Main/Main';
import Details from './components/Details/Details';
import Favourites from './components/Favourites/Favourites';
import Footer from './components/Footer/Footer';
import { AuthContext } from './context/AuthContext';

import { useLocalStorage } from './hooks/useLocalStorage';
import Logout from './components/Logout/Logout';
import AllBooks from './components/BookCatalog/AllBooks';

import { useLocation } from 'react-router-dom';
import CategoryBooks from './components/BookCatalog/CategoryBooks';

function App() {
  const [books, setBooks] = useState([]);
  const [bookByCategory, setBooksByCategory] = useState([]);
  const [auth, setAuth] = useLocalStorage('auth', {});

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
      .then(result => {
        setBooksByCategory(result);
        console.log(result);
      });
  }, [category]);

  const userLogin = (authData) => {
        setAuth(authData);
    };

    const userLogout = () => {
        setAuth({});
    };


  return (
    <AuthContext.Provider value={{ user: auth, userLogin, userLogout }}>

    <div className="wrapper">
      <Header />
      <BookContext.Provider value={{ books, bookByCategory }}>
        <main>
          <Routes>
            <Route path={'/'} element={<Main />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/register'} element={<Register />} />
            <Route path={'/logout'} element={<Logout />} />
            <Route path={'/details/:gameId'} element={<Details />} />
            <Route path={'/favourites'} element={<Favourites />} />

            <Route path={'/all-books'} element={<AllBooks />}/>
            <Route path={'/best-seller'} element={<CategoryBooks />}/>
            <Route path={'/fantasy'} element={<CategoryBooks />}/>
            <Route path={'/all-books'} element={<CategoryBooks />}/>
            <Route path={'/iconomic-and-business'} element={<CategoryBooks />}/>
            <Route path={'/psychology'} element={<CategoryBooks />}/>
            <Route path={'/autobiography'} element={<CategoryBooks />}/>
            <Route path={'/psychology'} element={<CategoryBooks />}/>

          </Routes>
        </main>
      </BookContext.Provider>
      <Footer />
    </div >
    </AuthContext.Provider>
  );
}

export default App;
