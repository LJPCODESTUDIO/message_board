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
      <Logout ShowNotification={ShowNotification} />
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