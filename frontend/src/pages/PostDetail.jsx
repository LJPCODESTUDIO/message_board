import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PostDetail() {
  const [PostData, SetPostData] = useState({
    _id: '',
    Title: '',
    Content: '',
    Likes: '',
    Dislikes: '',
    Poster: {
      _id: '',
      Username: ''
    }
  });
  const [PermissionLevel, SetPermissionLevel] = useState(0);
  const Navigate = useNavigate();
  let Params = useParams();

  useEffect(() => {
  const Controller = new AbortController();

  const LoadData = async () => {
    try {
      const PostRes = await axios.get(
        `/api/post/${Params.Id}`,
        { signal: Controller.signal }
      );

      SetPostData(PostRes.data);

      const PermissionRes = await axios.get(
        `/api/post/${Params.Id}/permission-level`,
        {
          withCredentials: true,
          signal: Controller.signal
        }
      );

      SetPermissionLevel(PermissionRes.data.Level);
    }
    catch (Err) {
      if (Err.code !== 'ERR_CANCELED') {
        console.error(Err);
      }
    }
  };

  LoadData();

  return () => Controller.abort();
}, [Params.Id]);

  const HandleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/delete/post/${Params.Id}`, {
          withCredentials: true
        });

        Navigate('/');
      }
      catch (Err) {
        console.error(Err);
        alert('Failed to delete post');
      }
    }
  }

  return (
    <div className="post-detail">
      <h3>{PostData.Poster.Username}</h3>
      <h1>{PostData.Title}</h1>
      {(PermissionLevel > 0) ? <button onClick={() => { Navigate(`/edit/post/${PostData._id}`, { state: { Title: PostData.Title, Content: PostData.Content }}); }}>Edit</button> : (<></>)}
      {(PermissionLevel > 0) ? <button className="delete-btn" onClick={HandleDelete}>Delete</button> : (<></>)}
      <p>{PostData.Content}</p>
    </div>
  );
}

export default PostDetail;