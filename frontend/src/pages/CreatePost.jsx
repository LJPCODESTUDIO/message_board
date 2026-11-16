import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function CreatePost() {
  const Params = useParams();
  const Location = useLocation();
  const [Title, SetTitle] = useState((Params.Id) ? Location.state.Title : '');
  const [Content, SetContent] = useState((Params.Id) ? Location.state.Content : '');
  const Navigate = useNavigate();

  const Action = (Params.Id) ? 'Edit' : 'Create';

  const handleSavePost = async (e) => {
    e.preventDefault();

    if (Action === 'Create') {
      await axios.post('/api/create/post', { Title: Title, Content: Content }, { withCredentials: true });
    }
    else {
      await axios.put(`/api/update/post/${Params.Id}`, { Title: Title, Content: Content }, { withCredentials: true });
    }
    Navigate('/');
  }

  return (
    <div>
      <form onSubmit={handleSavePost}>
        <h1>Enter a Title</h1>
        <input value={Title} onChange={(e) => { SetTitle(e.target.value) }} />
        <h1>Enter the Body</h1>
        <textarea value={Content} onChange={(e) => { SetContent(e.target.value) }} />
        <br />
        <button type="submit">{Action} Post</button>
      </form>
    </div>
  );
}

export default CreatePost;