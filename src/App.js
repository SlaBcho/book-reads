import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import { Login } from './components/Login/Login';
import Main from './components/Main/Main';

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path={'/login'} element={<Login />} />
        <Route path={'/'} element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
