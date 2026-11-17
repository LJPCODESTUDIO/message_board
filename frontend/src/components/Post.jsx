import { useNavigate } from 'react-router-dom';

function Post(props) {
  const Navigate = useNavigate();

  return (
    <div className="post-card">
      <button onClick={() => { Navigate(`/post/${props.Id}`)}}>
        <h3>{props.Username}</h3>
        <h1>{props.Title}</h1>
        <p>{props.Content}</p>
      </button>
    </div>
  );
}

export default Post;