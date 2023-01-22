import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';

import Main from './components/Main/Main';
import Details from './components/Details/Details';

function App() {

  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path={'/'} element={<Main />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/details'} element={<Details />} />
      </Routes>
    </div>
  );
}

export default App;
