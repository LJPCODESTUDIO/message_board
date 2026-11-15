import axios from "axios";
import { useState } from "react";

function CreatePost(props) {
  const [Title, SetTitle] = useState('');
  const [Content, SetContent] = useState('');

  const handleSavePost = (e) => {
    e.preventDefault();

    axios.post('/api/create/post', { Title: Title, Content: Content }, { withCredentials: true });
  }

  return (
    <div>
      <form onSubmit={handleSavePost}>
        <h1>Enter a Title</h1>
        <input value={Title} onChange={(e) => { SetTitle(e.target.value) }} />
        <h1>Enter the Body</h1>
        <textarea value={Content} onChange={(e) => { SetContent(e.target.value) }} />
        <br />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;