import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Signup() {
    const [Username, SetUsername] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/signup', {Username, Email, Password}, {WithCredentials: true})
        .then(result => {console.log(result)
        navigate('/login');
        })
        .catch(err => console.log(err));
    };


return(
    <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">
                    <strong>Name</strong>
                </label>
                <input type="text" placeholder="Enter Name"
                name="username" className="form-control"
                onChange={(e) => SetUsername(e.target.value)}/>
            </div>

            <div>
                <label htmlFor="email">
                    <strong>E-mail</strong>
                </label>
                <input type="email" placeholder="Enter E-mail"
                name="email" className="form-control"
                onChange={(e) => SetEmail(e.target.value)} />
            </div>

            <div>
                <label htmlFor="password">
                    <strong>Password</strong>
                </label>
                <input type="password" placeholder="Enter Password"
                name="password" className="form-control"
                onChange={(e) => SetPassword(e.target.value)}/>
            </div>

            <button type="submit" className="btn">
                Register
            </button>
        </form>
        <p>Already have an Account?</p>
        <Link to="/login" className="btn">Login</Link>
    </div>
);
}

export default Signup;