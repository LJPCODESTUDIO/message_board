import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Comment from '../components/Comment';
import TextToSpeech from '../components/TextToSpeech';
import CreateComment from '../components/CreateComment';

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
  const [ShowComments, SetShowComments] = useState(false);
  const Navigate = useNavigate();
  const Params = useParams();

  const FetchPostData = useCallback(async () => {
    try {
      const PostRes = await axios.get(`/api/post/${Params.Id}`);
      SetPostData(PostRes.data);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to load post', 'error');
    }
  }, [Params.Id, ShowNotification]);

  const FetchComments = useCallback(async () => {
    try {
      const Response = await axios.get(`/api/comments/${Params.Id}`);
      SetComments(Response.data);
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to load comments', 'error');
    }
  }, [Params.Id, ShowNotification]);

  const FetchPermissionLevel = useCallback(async () => {
    try {
      const PermissionRes = await axios.get(`/api/post/${Params.Id}/permission-level`, { withCredentials: true });
      SetPermissionLevel(PermissionRes.data.Level);
    }
    catch (Err) {
      if (Err.status === 401) return; 
      console.error(Err);
      ShowNotification('Failed to get permission level', 'error');
    }
  }, [Params.Id, ShowNotification]);

  useEffect(() => {
    const Controller = new AbortController();

    const FetchData = () => {
      FetchPostData();
      FetchComments();
      FetchPermissionLevel();
    };
    
    FetchData();
    return Controller.abort();
  }, [FetchPostData, FetchComments, FetchPermissionLevel]);

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
      await axios.post(`/api/create/comment/${Params.Id}`, { Content: CommentContent, IsParentPost: true }, { withCredentials: true });
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

  // Edit a comment
  const HandleEditComment = async (Id, NewContent) => {
    await axios.put(`/api/edit/comment/${Id}`, { Content: NewContent }, { withCredentials: true });
    FetchComments();
  }

  return (
    <div>
      <button onClick={() => Navigate('/')}>Back to Home</button>
      <div className="post-detail">
        <h3>{PostData.Poster.Username}</h3>
        <h1>{PostData.Title}</h1>

        {(PermissionLevel === 2) ? <button onClick={() => { Navigate(`/edit/post/${PostData._id}`, { state: { Title: PostData.Title, Content: PostData.Content } }); }}>Edit</button> : (<></>)}
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
            <CreateComment
              HandleComment={HandleComment}
              CommentContent={CommentContent}
              SetCommentContent={SetCommentContent}
              Action={'Add'}
            />

            {Comments.length === 0 && <p>No comments yet.</p>}
            {Comments.map(C => (
              <Comment key={C._id} Data={C} OnDelete={HandleDeleteComment} OnEdit={HandleEditComment} ShowNotification={ShowNotification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;