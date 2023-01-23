import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';

import Main from './components/Main/Main';
import Details from './components/Details/Details';
import Favourites from './components/Favourites/Favourites';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path={'/'} element={<Main />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/details'} element={<Details />} />
        <Route path={'/favourites'} element={<Favourites />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
