import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import getCookie from './util/CookieFetcher';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import './App.css';

function NotificationWrapper(props) {
    useLocation();
    return <Notification key={getCookie('token') || 'anonymous'} {...props} />;
}

function App() {
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
                <Route path='/changepassword/' element={<ChangePassword />} />
                <Route path='/profile/' element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;