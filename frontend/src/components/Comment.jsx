import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CreateComment from "./CreateComment";

function Comment({ Data, OnDelete, ShowNotification }) {
    const [PermissionLevel, SetPermissionLevel] = useState(0);
    const [Comments, SetComments] = useState([]);
    const [CommentContent, SetCommentContent] = useState('');
    const [ShowReply, SetShowReply] = useState(false);

    const FetchComments = useCallback(async () => {
        try {
            const Response = await axios.get(`/api/comments/${Data._id}`);
            SetComments(Response.data);
        }
        catch (Err) {
            console.error(Err);
            ShowNotification('Failed to load comments', 'error');
        }
    }, [Data._id, ShowNotification]);

    const FetchPermissionLevel = useCallback(async () => {
        try {
            const PermissionRes = await axios.get(`/api/post/${Data._id}/permission-level`, { withCredentials: true });
            SetPermissionLevel(PermissionRes.data.Level);
        }
        catch (Err) {
            if (Err.status === 401) return; 
            console.error(Err);
            ShowNotification('Failed to get permission level', 'error');
        }
    }, [Data._id, ShowNotification]);

    useEffect(() => {
    const Controller = new AbortController();

    const FetchData = () => {
            FetchComments();
            FetchPermissionLevel();
        };
        
        FetchData();
        return Controller.abort();
    }, [FetchComments, FetchPermissionLevel]);

    // Create a comment
    const HandleComment = async (e) => {
        e.preventDefault();
        if (CommentContent.trim() === '') {
            ShowNotification('Comment cannot be empty', 'error');
            return;
        }
        try {
            await axios.post(`/api/create/comment/${Data._id}`, { Content: CommentContent, IsParentPost: false }, { withCredentials: true });
            FetchComments();
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
        <div className="comment-card">

            <h3>{Data.Poster.Username}</h3>

            <p>{Data.Content}</p>

            {(PermissionLevel > 0) && (
                <button
                    className="delete-btn"
                    onClick={() => OnDelete(Data._id)}
                >
                    Delete Comment
                </button>
            )}

            <button onClick={() => SetShowReply(!ShowReply)}>Reply</button>
            {ShowReply && (
                <CreateComment
                    CommentContent={CommentContent}
                    SetCommentContent={SetCommentContent}
                    HandleComment={HandleComment}
                />
            )}

            <div className="comments-content">
                {Comments.map(C => (
                    <Comment key={C._id} Data={C} ShowNotification={ShowNotification} />
                ))}
            </div>
        </div>
    );
}

export default Comment;