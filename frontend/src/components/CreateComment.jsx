function CreateComment({HandleComment, CommentContent, SetCommentContent}) {
  return (
    <form onSubmit={HandleComment}>
      <label htmlFor="comment">Write a Comment</label>
      <textarea id="comment" placeholder="Enter your comment..." value={CommentContent} onChange={(e) => { SetCommentContent(e.target.value); }} />
      <button type="submit">Add Comment</button>
    </form>
  );
}

export default CreateComment;