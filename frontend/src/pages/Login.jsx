
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // so the browser accepts the cookie
        axios.post('http://localhost:4000/login', {email, password}, { withCredentials: true })  
        .then(result => {console.log(result)
            if(result.data.success){
                navigate('/home')
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
                    onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="password">
                        <strong>Password</strong>
                    </label>
                    <input type="password" placeholder="Enter Password"
                    name="password" className= "form-control"
                    onChange={(e) => setPassword(e.target.value)}>
                    </input>
                </div>

                <button type="submit" className="btn">
                    Login
                </button>
            </form>
            <p>Don't have an account yet?</p>
            <Link to="/register" className="btn">
            Sign Up
            </Link>
        </div>
    )
}
export default Login;