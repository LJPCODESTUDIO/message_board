import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Post from '../components/Post';
import getCookie from "../util/CookieFetcher";

function Profile({ ShowNotification}) {
  const [User, SetUser] = useState({
        _id: 'Null',
        Username: 'Null',
        Role: 'Null'
      });
  const [Posts, SetPosts] = useState([]);
  const [LikedPosts, SetLikedPosts] = useState([]);
  const [DislikedPosts, SetDislikedPosts] = useState([]);
  const [PermissionLevel, SetPermissionLevel] = useState(0);
  const Navigate = useNavigate();
  const Params = useParams();

  const FetchUser = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/profile/${Params.Id}`);
      SetUser(Response.data);
      const PermissionResponse = await axios.get(`/api/profile/${Params.Id}/permission-level`);
      SetPermissionLevel(PermissionResponse.data.Level);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to fetch user data', 'error');
    }
  }, [SetUser, ShowNotification, Params.Id, SetPermissionLevel]);

  const FetchPosts = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/posts?Poster=${Params.Id}`);
      SetPosts(Response.data);
      SetLikedPosts(getCookie('LikedPosts'));
      SetDislikedPosts(getCookie('DislikedPosts'));
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

  const HandleLikePost = async (Id) => {
    try {
      if (LikedPosts.includes(Id)) {
        await axios.put(`/api/remove/like/post/${Id}`, {}, { headers: { cookie: document.cookie }});
      }
      if (!LikedPosts.includes(Id)) {
        await axios.put(`/api/add/like/post/${Id}`, {}, { headers: { cookie: document.cookie }});
      }
      const Controller = new AbortController();
      FetchPosts(Controller);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to like post', 'error');
    }
  };

  const HandleDislikePost = async (Id) => {
    try {
      if (DislikedPosts.includes(Id)) {
        await axios.put(`/api/remove/dislike/post/${Id}`, {}, { headers: { cookie: document.cookie }});
      }
      if (!DislikedPosts.includes(Id)) {
        await axios.put(`/api/add/dislike/post/${Id}`, {}, { headers: { cookie: document.cookie }});
      }
      const Controller = new AbortController();
      FetchPosts(Controller);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to like post', 'error');
    }
  };

  const HandleMakeAdmin = async () => {
    if (!window.confirm('Are you sure? This action is not easily reversed.')) {
      return;
    }
    try {
      await axios.post(`/api/role/admin/${Params.Id}`, {}, { withCredentials: true });
      FetchUser();
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to make user an admin.', 'error');
    }
  }

  return (
    <div>
      <button onClick={() => Navigate('/')}>Back to Home</button>
      <h2>{User.Username}'s Profile</h2>
      {User.Role === 'admin' && (<p className="user-tag">Admin</p>)}
      {(User.Role !== 'admin' && PermissionLevel === 1) && (
        <button onClick={HandleMakeAdmin}>Make Admin</button>
      )}

      <h3>Posts by {User.Username}</h3>
      {Posts.length === 0 && <p>There's nothing here.</p>}
      {Posts.map(P => (
        <Post
          key={P._id}
          Id={P._id}
          Poster={P.Poster}
          Title={P.Title}
          Content={P.Content}
          Likes={P.Likes}
          Dislikes={P.Dislikes}
          OnLike={() => HandleLikePost(P._id)}
          OnDislike={() => HandleDislikePost(P._id)}
          LikedPost={LikedPosts.includes(P._id)}
          DislikedPost={DislikedPosts.includes(P._id)}
        />
      ))}
    </div>
  );
};

export default Profile;