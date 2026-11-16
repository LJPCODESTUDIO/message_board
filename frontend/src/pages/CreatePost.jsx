import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function CreatePost() {
  const Params = useParams();
  const Location = useLocation();
  const [Title, SetTitle] = useState((Params.Id) ? Location.state.Title : '');
  const [Content, SetContent] = useState((Params.Id) ? Location.state.Content : '');
  const [Errors, SetErrors] = useState([]);
  const Navigate = useNavigate();

  const Action = (Params.Id) ? 'Edit' : 'Create';

  const handleSavePost = async (e) => {
    e.preventDefault();
    let Response;
    let TempErrors = [];

    try {
      if (Action === 'Create') {
        Response = await axios.post('/api/create/post', { Title: Title, Content: Content }, { withCredentials: true });
      }
      else {
        Response = await axios.put(`/api/update/post/${Params.Id}`, { Title: Title, Content: Content }, { withCredentials: true });
      }
    }
    catch (Err) {
      console.error(Err);
      TempErrors = [...TempErrors, Err];
    }

    switch (Response.status) {
      case 201:
        Navigate('/')
        break;
      case 401:
        console.error(Response.data.message);
        TempErrors = [...TempErrors, Response.data.message];
        break;
      default:
        console.log(Response.data);
    }

    SetErrors(TempErrors);
  }

  return (
    <div>
      <form onSubmit={handleSavePost}>
        <h1>{Action} a Post</h1>
        <h2>Enter a Title</h2>
        <ul style={{ color: 'red' }}>
          {Errors.map((E) => (
            <li>{E}</li>
          ))}
        </ul>
        <input value={Title} onChange={(e) => { SetTitle(e.target.value) }} />
        <h2>Enter the Body</h2>
        <textarea value={Content} onChange={(e) => { SetContent(e.target.value) }} />
        <br />
        <button type="submit">{Action} Post</button>
      </form>
    </div>
  );
}

export default CreatePost;