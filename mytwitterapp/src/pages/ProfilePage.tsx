import React, { useEffect, useState } from "react";
import { useLocation,Link } from "react-router-dom";
import { ProfilePageProps, UserProfile } from "../types";
import { PastTweetList, LikeTweetList, BadTweetList } from "../components/Tweet/TweetList";
import { FaTwitter,FaArrowLeft } from "react-icons/fa";
import './ProfilePage.css';

export const ProfilePage: React.FC<ProfilePageProps> = ({data}) => {
    const location = useLocation();
    const { user_id } = location.state as { user_id: number };

    const [userName, setUserName] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<'tweets' | 'likes' | 'bads'>('tweets'); // タブの状態を追加

    const sendUserProfileRequest = async (user_id: number) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/userprofile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: user_id }),
            });
            if (!response.ok) {
                throw new Error("Failed to send UserProfile request");
            }
            const data: UserProfile = await response.json();
            setUserProfile(data);
            setUserName(data.user_name);
            setStatusMessage(data.status_message);
            console.log("UserProfile fetched successfully", data);
        } catch (error) {
            console.error("Error fetching user profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/userprofilemodify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    user_name: userName,
                    status_message: statusMessage,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to send UserProfile modify request");
            }
            const updatedProfile = { ...userProfile, user_name: userName, status_message: statusMessage };
            setUserProfile(updatedProfile as UserProfile);
            console.log("UserProfile modified successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Error modifying user profile", error);
        }
    };

    useEffect(() => {
        sendUserProfileRequest(user_id);
    }, [user_id]);

    if (loading) {
        return (
        <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        </div>
        )
    }

    if (!userProfile) {
        return <p>Failed to load profile</p>;
    }

    return (
        <div className="profile-page">
            <Link to="/" className="home">
                <FaArrowLeft size={40} className="profilepage-icon" />
            </Link>
            <FaTwitter size={40} className="profilepage-twitter-icon" />
            <div className="profile-header">
                {isEditing ? (
                    <div>
                        <label>
                            User Name:
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Status Message:
                            <input
                                type="text"
                                value={statusMessage || ''}
                                onChange={(e) => setStatusMessage(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button onClick={handleEditProfile}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p>User Name: {userProfile.user_name}</p>
                        <p>Status Message: {userProfile.status_message}</p>
                        {user_id === data?.user_id &&
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        }
                    </div>
                )}
            </div>

            {/* タブエリア */}
            <div className="tabs">
                <button 
                    className={selectedTab === 'tweets' ? 'active' : ''}
                    onClick={() => setSelectedTab('tweets')}
                >
                    ツイート
                </button>
                <button 
                    className={selectedTab === 'likes' ? 'active' : ''}
                    onClick={() => setSelectedTab('likes')}
                >
                    いいね
                </button>
                <button 
                    className={selectedTab === 'bads' ? 'active' : ''}
                    onClick={() => setSelectedTab('bads')}
                >
                    バッド
                </button>
            </div>

            {/* 選択されたタブに基づいてリストを表示 */}
            <div className="tab-content">
                {selectedTab === 'tweets' && <PastTweetList user_id={user_id} />}
                {selectedTab === 'likes' && <LikeTweetList user_id={user_id} />}
                {selectedTab === 'bads' && <BadTweetList user_id={user_id} />}
            </div>
        </div>
    );
};

export default ProfilePage;
