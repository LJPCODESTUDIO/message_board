import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'
import ChangePassword from './pages/ChangePassword';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Account from './pages/Account';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path='/create/post' element={<CreatePost />} />
          <Route path='/edit/post/:Id' element={<CreatePost />} />
          <Route path='/post/:Id' element={<PostDetail />} />
          <Route path='/changepassword/' element={<ChangePassword />} />
          <Route path='/account/' element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;