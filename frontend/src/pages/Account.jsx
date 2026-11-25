import  { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Account(){
    const [User, SetUser] = useState("");
    const [Error, SetError] = useState("");

useEffect(() => {
    async function loadAccount() {
        try{
            const ProfileResponse = await axios.get("/api/account", { withCredentials: true});
            SetUser(ProfileResponse.data.user)

         
        } catch (err) {
            SetError( err.response?.data?.message || "Could not load profile");
        }
        
    }loadAccount();
}, []);

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Username: </strong>{User?.IsAnonymous ? "Anonymous User" : User?.Username || "Anonymous User"}</p>
            <p><strong>Email:</strong>{User?.IsAnonymous? "Not shown for anonymous accounts" : User?.Email || "Not provided."}</p>
    
            {!User?.IsAnonymous && <Link to="/changepassword">Change Password</Link>} {/* shows change password link only if user is logged in. */}
            <Link to="/">Back to Message Board.</Link>
            {Error && <p>{Error}</p>}  {/* shows error message when error array contains messsages */}

        </div>
        
    )
}
export default Account;