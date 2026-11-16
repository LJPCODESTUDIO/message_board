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

  const FetchData = async () => {
    const PostRes = await axios.get(`/api/post/${Params.Id}`);
    SetPostData(PostRes.data);
    const PermissionRes = await axios.get(`/api/post/${Params.Id}/permission-level`, { withCredentials: true });
    SetPermissionLevel(PermissionRes.data.Level);
  }

  useEffect(() => {
    const Controller = new AbortController();
    FetchData();
    return () => Controller.abort();
  }, []);

  return (
    <div>
      <h3>{PostData.Poster.Username}</h3>
      <h1>{PostData.Title}</h1>
      {(PermissionLevel > 0) ? <button onClick={() => { Navigate(`/edit/post/${PostData._id}`, { state: { Title: PostData.Title, Content: PostData.Content }}); }}>Edit</button> : (<></>)}
      <p>{PostData.Content}</p>
    </div>
  );
}

export default PostDetail;