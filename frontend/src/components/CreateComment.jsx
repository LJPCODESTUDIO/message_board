import { useState } from "react";
import axios from "axios";

function CreateComment({ParentId, IsParentPost, ShowNotification}) {
  const [CommentContent, SetCommentContent] = useState('');

  // Create a comment
  const HandleComment = async (e) => {
    e.preventDefault();
    if (CommentContent.trim() === '') {
      ShowNotification('Comment cannot be empty', 'error');
      return;
    }
    try {
      await axios.post(`/api/create/comment/${ParentId}`, { Content: CommentContent, IsParentPost: IsParentPost }, { withCredentials: true });
      SetCommentContent('');
      ShowNotification('Comment created successfully');
    }
    catch (Err) {
      console.error(Err);
      ShowNotification('Failed to create comment', 'error');
      return;
    }
  };

  return (
    <form onSubmit={HandleComment}>
      <label htmlFor="comment">Write a Comment</label>
      <textarea id="comment" placeholder="Enter your comment..." value={CommentContent} onChange={(e) => { SetCommentContent(e.target.value); }} />
      <button type="submit">Add Comment</button>
    </form>
  );
}

export default CreateComment;