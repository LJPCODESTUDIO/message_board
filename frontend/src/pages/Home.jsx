import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post";
import getCookie from "../util/CookieFetcher";

function Home() {
  const [Posts, SetPosts] = useState([]);

  const FetchPosts = async () => {
    const Response = await axios.get('/api/posts');
    SetPosts(Response.data);
  }

  useEffect(() => {
    const Controller = new AbortController();
    FetchPosts();
    return () => Controller.abort(); // Apparently do this to avoid memory leaks
  }, []);

  return (
    <div>
      <Link to='/login'>Login</Link> <br />
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