import { useEffect, useState } from 'react';
import axios from 'axios';
import getCookie from '../util/CookieFetcher';

function Logout() {
    const [IsLoggedIn, SetIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = getCookie('token');
        if(token) {
            SetIsLoggedIn(true);
        }
    }, []);


const HandleLogout = async () => {
    try {
        await axios.post('http://localhost:4000/api/logout',
        {}, {withCredentials: true});
        SetIsLoggedIn(false);
        window.location.href= '/login';
        }catch (err) {
            console.error(err);
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
