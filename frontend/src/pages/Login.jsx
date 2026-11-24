
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login({ ShowNotification }) {
    const [Email, SetEmail] = useState();
    const [Password, SetPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const Response = await axios.post(
                '/api/login',
                { Email, Password },
                { withCredentials: true }
            );

            if (Response.data.success) {
                ShowNotification('Logged in successfully');
             navigate('/');
            }
         else {
             ShowNotification(
                    Response.data.message,
                    'error'
                );
            }
        }
        catch (Err) {
            ShowNotification(
                Err.response?.data?.message || 'Login failed',
                'error'
            );
        }
    };
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
            
            <p>Continue without an account</p> 
            <Link to="/" className="btn">Anonymous
            </Link>button here is temporary and to be edited
        </div>
    )
}
export default Login;