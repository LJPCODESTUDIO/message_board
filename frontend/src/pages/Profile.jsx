import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ShowNotification from '../components/Notification';
import { useParams } from "react-router-dom";

function Profile() {
  const [User, SetUser] = useState("");
  const [Posts, SetPosts] = useState([]);
  const Params = useParams();

  const FetchUser = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/profile/${Params.Id}`);
      SetUser(Response.data.user);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to fetch user data', 'error');
    }
  }, [SetUser, Params.Id]);

  const FetchPosts = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/posts?Poster=${Params.Id}`);
      SetPosts(Response.data);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to fetch user posts', 'error');
    }
  }, [SetPosts, Params.Id]);

  useEffect(() => {
    const Controller = new AbortController();

    const FetchData = async () => {
      FetchUser();
      FetchPosts();
    };

    FetchData();
    return Controller.abort();
  })

  return (
    <div>
      <h2>{User.Username}'s Profile</h2>
      {User.Role === 'admin' && (<p className="user-tag">Admin</p>)}
      
    </div>
  );
};

export default Profile;