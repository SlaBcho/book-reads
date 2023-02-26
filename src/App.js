import { Routes, Route, useNavigate } from 'react-router-dom';
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


function App() {
  const [books, setBooks] = useState([]);
  const [auth, setAuth] = useLocalStorage('auth', {});
  // const navigate = useNavigate();

  useEffect(() => {
    bookService.getAll()
      .then(result => {
        setBooks(result);
      });
  }, []);

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
      <BookContext.Provider value={{ books }}>
        <main>
          <Routes>
            <Route path={'/'} element={<Main />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/register'} element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path={'/details/:gameId'} element={<Details />} />
            <Route path={'/favourites'} element={<Favourites />} />
          </Routes>
        </main>
      </BookContext.Provider>
      <Footer />
    </div >
    </AuthContext.Provider>
  );
}

export default App;
