function Comment({ Data, CurrentUser, OnDelete }) {

    return (
        <div className="comment-card">

            <h3>{Data.Poster.Username}</h3>

            <p>{Data.Content}</p>

            {CurrentUser &&
                CurrentUser._id === Data.Poster._id && (

                <button
                    className="delete-btn"
                    onClick={() => OnDelete(Data._id)}
                >
                    Delete Comment
                </button>

            )}

        </div>
    );
}

export default Comment;