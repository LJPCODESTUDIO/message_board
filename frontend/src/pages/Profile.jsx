import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
  const Params = useParams();

  const FetchUser = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/profile/${Params.Id}`);
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

  return (
    <div>
      <h2>{User.Username}'s Profile</h2>
      {User.Role === 'admin' && (<p className="user-tag">Admin</p>)}

      <h3>Posts by {User.Username}</h3>
      {Posts.map(P => (
        <Post
          key={P._id}
          Id={P._id}
          Username={P.Poster.Username}
          Role={P.Poster.Role}
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