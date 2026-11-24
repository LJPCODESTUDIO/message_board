import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Comment from '../components/Comment';
import TextToSpeech from '../components/TextToSpeech';

function PostDetail({ ShowNotification }) {
  const [PostData, SetPostData] = useState({
    _id: '',
    Title: '',
    Content: '',
    Likes: 0,
    Dislikes: 0,
    Poster: {
      _id: '',
      Username: ''
    }
  });
  const [PermissionLevel, SetPermissionLevel] = useState(0);
  const [Comments, SetComments] = useState([]);
  const [CommentContent, SetCommentContent] = useState('');
  const [CurrentUser, SetCurrentUser] = useState(null);
  const [ShowComments, SetShowComments] = useState(false);
  const Navigate = useNavigate();
  const Params = useParams();

  const FetchComments = useCallback(async () => {
    const Response = await axios.get(`/api/comments/${Params.Id}`);
    SetComments(Response.data);
  }, [Params.Id]);

  useEffect(() => {
    const LoadData = async () => {
      try {
        const PostRes = await axios.get(`/api/post/${Params.Id}`);
        SetPostData(PostRes.data);
        await FetchComments();
        SetPermissionLevel(0);
        SetCurrentUser(null);
        try {
          const UserRes = await axios.get('/api/current-user', { withCredentials: true });
          SetCurrentUser(UserRes.data);
          const PermissionRes = await axios.get(`/api/post/${Params.Id}/permission-level`, { withCredentials: true });
          SetPermissionLevel(PermissionRes.data.Level);
        }
        catch (Err) {
          if (Err.response?.status !== 401) {
            console.error(Err);
          }
        }
      }
      catch (Err) {
        console.error(Err);
        ShowNotification('Failed to load post', 'error');
      }
    };
    LoadData();
  }, [Params.Id, FetchComments, ShowNotification]);

  // Delete a post
  const HandleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await axios.delete(`/api/delete/post/${Params.Id}`, { withCredentials: true });
      ShowNotification('Post deleted successfully');
      Navigate('/');
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to delete post', 'error');
    }
  };

  // Create a comment
  const HandleComment = async (e) => {
    e.preventDefault();
    if (CommentContent.trim() === '') {
      ShowNotification('Comment cannot be empty', 'error');
      return;
    }
    try {
      await axios.post(`/api/create/comment/${Params.Id}`, { Content: CommentContent }, { withCredentials: true });
      SetCommentContent('');
      ShowNotification('Comment created successfully');
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to create comment', 'error');
      return;
    }
    try {
      await FetchComments();
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Comment saved, but the list could not refresh', 'error');
    }
  };

  // Delete a comment
  const HandleDeleteComment = async (Id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      await axios.delete(`/api/delete/comment/${Id}`, { withCredentials: true });
      SetComments(PreviousComments => PreviousComments.filter(C => C._id !== Id));
      ShowNotification('Comment deleted successfully');
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to delete comment', 'error');
    }
  };

  return (
    <div>
      <button onClick={() => Navigate('/')}>Back to Home</button>
      <div className="post-detail">
        <h3>{PostData.Poster.Username}</h3>
        <h1>{PostData.Title}</h1>
        {(PermissionLevel > 0) ? <button onClick={() => { Navigate(`/edit/post/${PostData._id}`, { state: { Title: PostData.Title, Content: PostData.Content } }); }}>Edit</button> : (<></>)}
        {(PermissionLevel > 0) ? <button className="delete-btn" onClick={HandleDelete}>Delete</button> : (<></>)}
        <p>{PostData.Content}</p>
        <TextToSpeech Text={`${PostData.Title}. ${PostData.Content}`} />
      </div>
      <div className="comments-section">
        <div className="comments-header">
          <h2>Comments ({Comments.length})</h2>
          <button className="view-comments-btn" onClick={() => SetShowComments(!ShowComments)} aria-expanded={ShowComments}>
            {ShowComments ? 'Hide Comments' : 'View Comments'}
          </button>
        </div>
        {ShowComments && (
          <div className="comments-content">
            {Comments.length === 0 && <p>No comments yet.</p>}
            {Comments.map(C => (
              <Comment key={C._id} Data={C} CurrentUser={CurrentUser} OnDelete={HandleDeleteComment} />
            ))}
            {CurrentUser && CurrentUser.Username !== 'anonymous' ? (
              <form onSubmit={HandleComment}>
                <label htmlFor="comment">Write a Comment</label>
                <textarea id="comment" placeholder="Enter your comment..." value={CommentContent} onChange={(e) => { SetCommentContent(e.target.value); }} />
                <button type="submit">Add Comment</button>
              </form>
            ) : (
              <p>Log in to leave a comment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;