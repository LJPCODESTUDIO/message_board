import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
<<<<<<< HEAD
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import getCookie from './util/CookieFetcher';
=======
import Home from './pages/Home'
import ChangePassword from './pages/ChangePassword';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
>>>>>>> 368f5226ee3e6296f571071209c58ef65db19a32
import './App.css';

function NotificationWrapper(props) {
    useLocation();
    return <Notification key={getCookie('token') || 'anonymous'} {...props} />;
}

function App() {
<<<<<<< HEAD
    const [Theme, SetTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [Message, SetMessage] = useState('');
    const [Type, SetType] = useState('success');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', Theme);
        localStorage.setItem('theme', Theme);
    }, [Theme]);

    const ShowNotification = useCallback((Message, Type = 'success') => {
        SetMessage(Message);
        SetType(Type);
    }, []);

    const CloseNotification = useCallback(() => {
        SetMessage('');
    }, []);

    return (
        <BrowserRouter>
            <div className="top-controls">
                <NotificationWrapper Message={Message} Type={Type} OnClose={CloseNotification} />
                <ThemeToggle Theme={Theme} SetTheme={SetTheme} />
            </div>
            <Routes>
                <Route path='/' element={<Home ShowNotification={ShowNotification} />} />
                <Route path='/login' element={<Login ShowNotification={ShowNotification} />} />
                <Route path='/signup' element={<Signup ShowNotification={ShowNotification} />} />
                <Route path='/create/post' element={<CreatePost ShowNotification={ShowNotification} />} />
                <Route path='/edit/post/:Id' element={<CreatePost ShowNotification={ShowNotification} />} />
                <Route path='/post/:Id' element={<PostDetail ShowNotification={ShowNotification} />} />
            </Routes>
        </BrowserRouter>
    );
=======
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
          <Route path='/profile/' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> 368f5226ee3e6296f571071209c58ef65db19a32
}

export default App;