import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CreateComment from "./CreateComment";
import getCookie from "../util/CookieFetcher";

function Comment({ Data, OnDelete, OnEdit, OnLike, OnDislike, LikedComment, DislikedComment, ShowNotification }) {
    const [PermissionLevel, SetPermissionLevel] = useState(0);
    const [Replies, SetReplies] = useState([]);
    const [ReplyContent, SetReplyContent] = useState('');
    const [ShowReply, SetShowReply] = useState(false);
    const [ReplyAction, SetReplyAction] = useState('Comment');
    const [LikedReplies, SetLikedReplies] = useState([]);
    const [DislikedReplies, SetDislikedReplies] = useState([]);

    const FetchReplies = useCallback(async () => {
        try {
            const Response = await axios.get(`/api/comments/${Data._id}`);
            SetReplies(Response.data);
            SetLikedReplies(getCookie('LikedComments'));
            SetDislikedReplies(getCookie('DislikedComments'));
        }
        catch (Err) {
            console.error(Err);
            ShowNotification('Failed to load comments', 'error');
        }
    }, [Data._id, ShowNotification]);

    const FetchPermissionLevel = useCallback(async () => {
        try {
            const PermissionRes = await axios.get(`/api/comment/${Data._id}/permission-level`, { withCredentials: true });
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
            FetchReplies();
            FetchPermissionLevel();
        };
        
        FetchData();
        return Controller.abort();
    }, [FetchReplies, FetchPermissionLevel]);

    // Create a comment
    const HandleComment = async (e) => {
        e.preventDefault();
        if (ReplyContent.trim() === '') {
            ShowNotification('Comment cannot be empty', 'error');
            return;
        }
        try {
            if (ReplyAction === 'Edit') {
                OnEdit(Data._id, ReplyContent);
                ShowNotification('Comment edited successfully');
            }
            else {
                await axios.post(`/api/create/comment/${Data._id}`, { Content: ReplyContent, IsParentPost: false }, { withCredentials: true });
                ShowNotification('Comment created successfully');
            }
            
            FetchReplies();
            SetReplyContent('');
            SetShowReply(false);
        }
        catch (Err) {
            console.error(Err);
            ShowNotification('Failed to create comment', 'error');
            return;
        }
    };

    // Delete a comment
    const HandleDeleteComment = async (Id) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        try {
            await axios.delete(`/api/delete/comment/${Id}`, { withCredentials: true });
            FetchReplies();
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
        FetchReplies();
    }

    const HandleLikeReply = async (Id) => {
        try {
        if (LikedReplies.includes(Id)) {
            await axios.put(`/api/remove/like/comment/${Id}`, {}, { headers: { cookie: document.cookie }});
        }
        if (!LikedReplies.includes(Id)) {
            await axios.put(`/api/add/like/comment/${Id}`, {}, { headers: { cookie: document.cookie }});
        }
        FetchReplies();
        }
        catch (Err) {
        console.error(Err);
        ShowNotification('Failed to like comment', 'error');
        }
    }

    const HandleDislikeReply = async (Id) => {
        try {
        if (DislikedReplies.includes(Id)) {
            await axios.put(`/api/remove/dislike/comment/${Id}`, {}, { headers: { cookie: document.cookie }});
        }
        if (!DislikedReplies.includes(Id)) {
            await axios.put(`/api/add/dislike/comment/${Id}`, {}, { headers: { cookie: document.cookie }});
        }
        FetchReplies();
        }
        catch (Err) {
        console.error(Err);
        ShowNotification('Failed to dislike comment', 'error');
        }
    }

    return (
        <div className="comment-card">

            <Link to={`/profile/${Data.Poster._id}`}>
                <h3>{Data.Poster.Username} {Data.Poster.Username === 'admin' && (<span className="user-tag">Admin</span>)}</h3>
            </Link>

            <p>{Data.Content}</p>
            <button onClick={OnLike}>{Data.Likes} - {LikedComment ? 'Unlike' : 'Like'}</button>
            <button onClick={OnDislike}>{Data.Dislikes} - {DislikedComment ? 'Undislike' : 'Dislike'}</button>

            {(PermissionLevel > 0) && (
                <button
                    className="delete-btn"
                    onClick={() => OnDelete(Data._id)}
                >
                    Delete Comment
                </button>
            )}
            {(PermissionLevel === 2) && (
                <button
                    onClick={() => {SetShowReply(!ShowReply); SetReplyAction('Edit'); SetReplyContent(Data.Content);}}
                >
                    Edit Comment
                </button>
            )}

            <button onClick={() => {SetShowReply(!ShowReply); SetReplyAction('Add'); SetReplyContent('');}}>Reply</button>
            {ShowReply && (
                <CreateComment
                    CommentContent={ReplyContent}
                    SetCommentContent={SetReplyContent}
                    HandleComment={HandleComment}
                    Action={ReplyAction}
                />
            )}

            <div className="comments-content">
                {Replies.map(C => (
                    <Comment
                        key={C._id} 
                        Data={C} 
                        OnDelete={HandleDeleteComment}
                        OnEdit={HandleEditComment}
                        OnLike={() => HandleLikeReply(C._id)}
                        OnDislike={() => HandleDislikeReply(C._id)}
                        LikedComment={LikedReplies.includes(C._id)}
                        DislikedComment={DislikedReplies.includes(C._id)}
                        ShowNotification={ShowNotification}
                    />
                ))}
            </div>
        </div>
    );
}

export default Comment;