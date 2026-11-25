import { useNavigate } from 'react-router-dom';

function Post({Id, Username, Title, Content, Likes, Dislikes, OnLike, OnDislike, LikedPost, DislikedPost}) {
  const Navigate = useNavigate();

  return (
    <div className="post-card">
      <button onClick={() => { Navigate(`/post/${Id}`)}}>
        <h3>{Username}</h3>
        <h1>{Title}</h1>
        <p>{Content}</p>
      </button>

      <div className='post-actions'>
        <button onClick={OnLike}>{Likes} - {LikedPost ? 'Unlike' : 'Like'}</button>
        <button onClick={OnDislike}>{Dislikes} - {DislikedPost ? 'Undislike' : 'Dislike'}</button>
      </div>
    </div>
  );
}

export default Post;