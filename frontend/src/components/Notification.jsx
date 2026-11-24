import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import getCookie from '../util/CookieFetcher';

function Notification({ Message, Type, OnClose }) {

    const [Notifications, SetNotifications] = useState([]);
    const [ShowNotifications, SetShowNotifications] = useState(false);

    const Navigate = useNavigate();
    const Location = useLocation();

    const IsLoggedIn = Boolean(getCookie('token'));

    useEffect(() => {
        if (!Message) {
            return;
        }

        const Timer = setTimeout(() => {
            OnClose();
        }, 4000);

        return () => clearTimeout(Timer);

    }, [Message, OnClose]);

    const FetchNotifications = async () => {
        try {
            const Response = await axios.get(
                '/api/notifications',
                { withCredentials: true }
            );

            SetNotifications(Response.data);
        }
        catch (Err) {
            SetNotifications([]);

            if (Err.response?.status !== 401) {
                console.error(Err);
            }
        }
    };

    useEffect(() => {
    if (!IsLoggedIn) {
        return;
    }

    const Controller = new AbortController();

    const LoadNotifications = async () => {
        try {
            const Response = await axios.get(
                '/api/notifications',
                {
                    withCredentials: true,
                    signal: Controller.signal
                }
            );

            if (!Controller.signal.aborted) {
                SetNotifications(Response.data);
            }
        }
        catch (Err) {
            if (Err.code !== 'ERR_CANCELED') {
                console.error(Err);
            }
        }
    };

    LoadNotifications();

    const Timer = setInterval(
        LoadNotifications,
        5000
    );

    return () => {
        clearInterval(Timer);
        Controller.abort();
    };

    }, [IsLoggedIn, Location.pathname]);

    const UnreadCount = Notifications.filter(
        N => !N.IsRead
    ).length;

    const HandleNotifications = async () => {

        SetShowNotifications(!ShowNotifications);

        if (!ShowNotifications) {
            try {
                await axios.put(
                    '/api/notifications/read',
                    {},
                    { withCredentials: true }
                );

                await FetchNotifications();
            }
            catch (Err) {
                console.error(Err);
            }
        }
    };

    return (
        <>

            {Message && (
                <div
                    className={`notification ${Type}`}
                    role={Type === 'error' ? 'alert' : 'status'}
                >
                    <span>{Message}</span>

                    <button onClick={OnClose}>
                        Close
                    </button>
                </div>
            )}

            {IsLoggedIn && (
                <div className="notification-container">

                    <button
                        className="notification-btn"
                        onClick={HandleNotifications}
                        aria-expanded={ShowNotifications}
                    >
                        Notifications ({UnreadCount})
                    </button>

                    {ShowNotifications && (
                        <div className="notification-panel">

                            <h2>Notifications</h2>

                            {Notifications.length === 0 && (
                                <p>No notifications.</p>
                            )}

                            {Notifications.map(N => (
                                <button
                                    key={N._id}
                                    className="notification-item"
                                    onClick={() => {
                                        SetShowNotifications(false);
                                        Navigate(`/post/${N.Post}`);
                                    }}
                                >
                                    <p>{N.Message}</p>

                                    <small>
                                        {new Date(
                                            N.CreationDate
                                        ).toLocaleString()}
                                    </small>
                                </button>
                            ))}

                        </div>
                    )}

                </div>
            )}
        </>
    );
}

export default Notification;