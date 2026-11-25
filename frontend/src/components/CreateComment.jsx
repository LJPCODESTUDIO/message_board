function CreateComment({HandleComment, CommentContent, SetCommentContent, Action}) {
  return (
    <form onSubmit={HandleComment}>
      <label htmlFor="comment">{Action} a Comment</label>
      <textarea id="comment" placeholder="Enter your comment..." value={CommentContent} onChange={(e) => { SetCommentContent(e.target.value); }} />
      <button type="submit">{Action} Comment</button>
    </form>
  );
}

export default CreateComment;