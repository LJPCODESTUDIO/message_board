
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [Email, SetEmail] = useState();
    const [Password, SetPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // so the browser accepts the cookie
        axios.post('/api/login', {Email, Password}, { withCredentials: true })  
        .then(result => {console.log(result)
            if(result.data.success){
                navigate('/home');
            }
        })
        .catch(err=> console.log(err));
    }
    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input type="email" placeholder="Enter Email Adress"
                    name="email" className = "form-control"
                    onChange={(e) => SetEmail(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="password">
                        <strong>Password</strong>
                    </label>
                    <input type="password" placeholder="Enter Password"
                    name="password" className= "form-control"
                    onChange={(e) => SetPassword(e.target.value)}>
                    </input>
                </div>

                <button type="submit" className="btn">
                    Login
                </button>
            </form>
            <p>Don't have an account yet?</p>
            <Link to="/signup" className="btn">
            Sign Up
            </Link>
        </div>
    )
}
export default Login;