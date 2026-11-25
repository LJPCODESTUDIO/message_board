import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Profile({ ShowNotification}) {
  const [User, SetUser] = useState({
        _id: 'Null',
        Username: 'Null',
        Role: 'Null'
      });
  const [Posts, SetPosts] = useState([]);
  const Params = useParams();

  const FetchUser = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/profile/${Params.Id}`);
      console.log(Response);
      SetUser(Response.data);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to fetch user data', 'error');
    }
  }, [SetUser, ShowNotification, Params.Id]);

  const FetchPosts = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/posts?Poster=${Params.Id}`);
      SetPosts(Response.data);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to fetch user posts', 'error');
    }
  }, [SetPosts, ShowNotification, Params.Id]);

  useEffect(() => {
    const Controller = new AbortController();

    const FetchData = async () => {
      FetchUser();
      FetchPosts();
    };

    FetchData();
    return Controller.abort();
  }, [FetchPosts, FetchUser]);

  return (
    <div>
      <h2>{User.Username}'s Profile</h2>
      {User.Role === 'admin' && (<p className="user-tag">Admin</p>)}

      <h3>Posts by {User.Username}</h3>
    </div>
  );
};

export default Profile;