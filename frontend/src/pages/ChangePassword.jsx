import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ChangePassword() {
    const [OldPassword, setOldPassword] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [Message, setMessage] = useState("");
    const [Error, setError] = useState('');


const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
        const res = await axios.post(
            "/api/changepassword",
            { OldPassword, NewPassword },
            { withCredentials: true}
        );
        console.log("response", res.data); //debugging
        setMessage(res.data.msg || "Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
    }  catch (err) {
    
    setError(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Password update failed"
    );
}}

return (
    <>
    <form onSubmit={handleSubmit}>
        <h2>Change Password</h2>
    

    <div>
        <label htmlFor="Old-Password">Current Password</label>
        <input id="Old-Password" type="password" value={OldPassword}
        onChange={(e) => setOldPassword(e.target.value)} required />
    </div>
        <div>
        <label htmlFor="New-Password">New Password</label>
        <input id="New-Password" type="password" value={NewPassword}
        onChange={(e) => setNewPassword(e.target.value)} required />
    </div>

    <button type="submit">Update Password</button>
    <Link to="/profile" className="btn">Cancel</Link>
    </form>
    {Message && <p>{Message}</p>}
    {Error && <p>{Error}</p>}
    </>
);
}
export default ChangePassword;