import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post";
import getCookie from "../util/CookieFetcher";
import Logout from "../components/Logout";

function Home({ ShowNotification }) {
  const [Posts, SetPosts] = useState([]);
  const [LikedPosts, SetLikedPosts] = useState([]);
  const [DislikedPosts, SetDislikedPosts] = useState([]);

  const FetchPosts = useCallback(async (Controller) => {
    try {
      const Response = await axios.get('/api/posts', { signal: Controller.signal });
      SetPosts(Response.data);
      SetLikedPosts(getCookie('LikedPosts'));
      SetDislikedPosts(getCookie('DislikedPosts'));
    }
    catch (Err) {
      if (Err.code !== 'ERR_CANCELED') {
        console.error(Err);
        ShowNotification('Failed to load posts', 'error');
      }
    }
  }, [SetPosts, ShowNotification]);

  useEffect(() => {
    const Controller = new AbortController();

    const FetchData = () => {
      FetchPosts(Controller);
    }

    FetchData();
    return () => Controller.abort();
  }, [FetchPosts]);

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
      <Logout ShowNotification={ShowNotification} />
      <Link to='/account'>Account</Link>
      <br />
      {getCookie('token') !== '' ? (
        <Link to='/create/post'>Create Post</Link>
      ) : (<></>)}
      <h1>Posts</h1>
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
}

export default Home;