import { useNavigate, Link } from 'react-router-dom';

function Post({Id, Title, Content, Poster, Likes, Dislikes, OnLike, OnDislike, LikedPost, DislikedPost}) {
  const Navigate = useNavigate();

  return (
    <div className="post-card">
      <Link to={`/profile/${Poster._id}`}>
        <h3>{Poster.Username} {Poster.Username === 'admin' && (<span className="user-tag">Admin</span>)}</h3>
      </Link>
      <button onClick={() => { Navigate(`/post/${Id}`)}}>
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