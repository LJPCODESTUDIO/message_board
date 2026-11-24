import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getCookie from '../util/CookieFetcher';

function Logout({ ShowNotification }) {
    const [IsLoggedIn, SetIsLoggedIn] = useState(() => Boolean(getCookie('token')));
    const Navigate = useNavigate();

    const HandleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            SetIsLoggedIn(false);
            ShowNotification('Logged out successfully');
            Navigate('/login');
        }
        catch (err) {
            console.error(err);
            ShowNotification('Failed to log out', 'error');
        }
    };

    return (
        <nav>
            <a href="/">Home</a>
            {IsLoggedIn ? (
                <button onClick={HandleLogout}>Logout</button>
            ) : (
                <a href="/login">Login</a>
            )}
        </nav>
    );
}
export default Logout;