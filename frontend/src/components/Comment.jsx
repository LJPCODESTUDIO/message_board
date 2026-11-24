import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CreateComment from "./CreateComment";

function Comment({ Data, OnDelete, ShowNotification }) {
    const [PermissionLevel, SetPermissionLevel] = useState(0);
    const [Comments, SetComments] = useState([]);
    const [ShowReply, SetShowReply] = useState(false);

    const FetchComments = useCallback(async () => {
        const Response = await axios.get(`/api/comments/${Data._id}`);
        SetComments(Response.data);
    }, [Data._id]);

    useEffect(() => {
        const LoadData = async () => {
            try {
                SetPermissionLevel(0);
                const PermissionRes = await axios.get(`/api/comment/${Data._id}/permission-level`, { withCredentials: true });
                SetPermissionLevel(PermissionRes.data.Level);

                await FetchComments();
            }
            catch (Err) {
                console.error(Err);
            }
        };
        LoadData();
    }, [Data._id]);

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
                    ParentId={Data._id}
                    IsParentPost={false}
                    ShowNotification={ShowNotification}
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