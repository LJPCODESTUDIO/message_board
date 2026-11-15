function Post(props) {
  return (
    <div style={{ border: '2px solid black' }}>
      <h3>{props.Username}</h3>
      <h1>{props.Title}</h1>
      <p>{props.Content}</p>
    </div>
  );
}

export default Post;