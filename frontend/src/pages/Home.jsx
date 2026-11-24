import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post";
import getCookie from "../util/CookieFetcher";
import Logout from "../components/Logout";

function Home({ ShowNotification }) {
  const [Posts, SetPosts] = useState([]);

  useEffect(() => {
    const Controller = new AbortController();

    const FetchPosts = async () => {
      try {
        const Response = await axios.get('/api/posts', { signal: Controller.signal });
        SetPosts(Response.data);
      }
      catch (Err) {
        if (Err.code !== 'ERR_CANCELED') {
          console.error(Err);
          ShowNotification('Failed to load posts', 'error');
        }
      }
    };

    FetchPosts();
    return () => Controller.abort();
  }, [ShowNotification]);

  return (
    <div>
<<<<<<< HEAD
      <Logout ShowNotification={ShowNotification} />
=======
      <Logout />
      <Link to='/profile'>Profile</Link>
>>>>>>> 368f5226ee3e6296f571071209c58ef65db19a32
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
          Title={P.Title}
          Content={P.Content}
          Likes={P.Likes}
          Dislikes={P.Dislikes}
        />
      ))}
    </div>
  );
}

export default Home;