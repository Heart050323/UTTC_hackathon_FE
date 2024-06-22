import React, { useEffect,useState } from 'react';
import {TweetData, UserIDProps} from '../../types'
import {ValuationButton, ReplyButton, ReTweetButton} from './TweetItem'
import './TweetListStyles.css';
import { useNavigate } from 'react-router-dom';

export const sendTweetRequest = async(tweet_id: number) => {
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/tweetcall" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tweet_id: tweet_id}),
        });
        if (!response.ok) {
            throw new Error("Failed to send tweetcall request");
        }
        const tweetdata :TweetData = await response.json();
        console.log("tweetcall sent successfully");
        return tweetdata;
    }catch (error){
        console.error("Error sending tweetlist request", error);
    }
};
export const TweetList: React.FC<UserIDProps> = ({user_id})=> {
    const [tweetdata, setTweetData] = useState<TweetData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [retweetData, setRetweetData] = useState<{ [key: number]: TweetData }>({});
    const navigate = useNavigate();
    useEffect(() => {
        const sendTweetListRequest = async () => {
            setLoading(true);
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/tweetlist" , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to send tweetlist request");
                }
                const tweetdata :[TweetData] = await response.json();
                setTweetData(tweetdata);
                console.log("tweetlist sent successfully");
            }catch (error){
                console.error("Error sending tweetlist request", error);
            }finally{
                setLoading(false);
        }
    };
        sendTweetListRequest();
    },[]);
    const handleTweetClick = (tweet: TweetData) => {
        navigate('/tweetpage', {state:{tweet}});
    };

    const fetchTweetData = async (tweetID: number) => {
        try {
            const data = await sendTweetRequest(tweetID);
            return data;
        } catch (error) {
            console.error("Error fetching tweet data", error);
            return undefined;
        }
    };

    useEffect(() => {
        if (tweetdata) {
            const fetchRetweetData = async () => {
                const retweetDataMap: { [key: number]: TweetData } = {};
                for (const tweet of tweetdata) {
                    if (tweet.re_tweet_id !== 0) {
                        const data = await fetchTweetData(tweet.re_tweet_id);
                        if (data) {
                            retweetDataMap[tweet.re_tweet_id] = data;
                        }
                    }
                }
                setRetweetData(retweetDataMap);
            };
            fetchRetweetData();
        }
    }, [tweetdata]);

    return (
        <div className="tweet-list-container">
            {loading && 
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            }
            {tweetdata && (
                tweetdata.map((tweet) => (
                    <div key={tweet.tweet_id} className="tweet" style={{ padding: '10px', borderBottom: '1px solid #e1e1e1', backgroundColor: 'transparent' }}>
                        {tweet.re_tweet_id !== 0 && tweet.content.length === 0 && (
                            <div className='tweet-container'>
                                <p className="tweet-user">{tweet.user_name}がリツイートしました</p>
                                <div className='re-tweet-container' onClick={(e) => { e.stopPropagation(); handleTweetClick(retweetData[tweet.re_tweet_id]) }}>
                                <ReTweetedTweet re_tweet_id={tweet.re_tweet_id} user_id={user_id}/>
                                {retweetData[tweet.re_tweet_id] && (
                                    <div className='button-container'>
                                        <ReplyButton sender_user_id={user_id} tweet={retweetData[tweet.re_tweet_id]} />
                                        <ValuationButton sender_user_id={user_id} tweet={retweetData[tweet.re_tweet_id]} />
                                        <ReTweetButton sender_user_id={user_id} tweet={retweetData[tweet.re_tweet_id]} />
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                        {tweet.re_tweet_id !== 0 && tweet.content.length > 0 && (
                            <div className='tweet-container' onClick={() => handleTweetClick(tweet)}>
                                <p className="tweet-user">{tweet.user_name}</p>
                                <p className='tweet-content'>{tweet.content}</p>
                                <p className='tweet-time'>{new Date(tweet.created_at).toLocaleString()}</p>
                                <div className='re-tweet-container' onClick={(e) => { e.stopPropagation(); handleTweetClick(retweetData[tweet.re_tweet_id]) }}>
                                <ReTweetedTweet re_tweet_id={tweet.re_tweet_id} user_id={user_id} />
                                </div>
                                <div className='button-container'>
                                    <ReplyButton sender_user_id = {user_id} tweet = {tweet}/> 
                                    <ValuationButton sender_user_id = {user_id} tweet = {tweet}/>
                                    <ReTweetButton sender_user_id = {user_id} tweet = {tweet}/>
                                </div>
                            </div>
                        )}
                        {tweet.re_tweet_id === 0 && (
                            <div className='tweet-container' onClick={() => handleTweetClick(tweet)}>
                                <p className="tweet-user">{tweet.user_name}</p>
                                <p className='tweet-content'>{tweet.content}</p>
                                <p className='tweet-time'>{new Date(tweet.created_at).toLocaleString()}</p>
                                <div className='button-container'>
                                    <ReplyButton sender_user_id = {user_id} tweet = {tweet}/> 
                                    <ValuationButton sender_user_id = {user_id} tweet = {tweet}/>
                                    <ReTweetButton sender_user_id = {user_id} tweet = {tweet}/>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
        );
    };
export const ReTweetedTweet: React.FC<{ re_tweet_id: number ,user_id : number | undefined }> = ({ re_tweet_id ,user_id}) => {
    
    const [reTweetData, setReTweetData] = useState<TweetData>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchReTweetData = async () => {
            setLoading(true);
            try {
                const data = await sendTweetRequest(re_tweet_id);
                setReTweetData(data);
                console.log("これがリツイート内容です",data)
            } catch (error) {
                console.error("Error fetching retweet data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReTweetData();
    }, [re_tweet_id]);

    return (
        <div className="retweeted-tweet-container">
            {loading && 
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            }
            {reTweetData && (
                <div className="retweeted-tweet-container">
                    <p className="tweet-user">{reTweetData.user_name}</p>
                    <p className='tweet-content'>{reTweetData.content}</p>
                    <p className='tweet-time'>{new Date(reTweetData.created_at).toLocaleString()}</p>
                    {reTweetData.re_tweet_id !== 0 && (
                    <div className='re-tweet-container'>
                        <ReTweetedTweet re_tweet_id={reTweetData.re_tweet_id} user_id={user_id} />
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const RepliedTweet: React.FC<{ replied_tweet_id: number ,user_id : number | undefined }> = ({ replied_tweet_id ,user_id}) => {
    const [repliedTweetData, setRepliedTweetData] = useState<TweetData>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchRepliedTweetData = async () => {
            setLoading(true);
            try {
                const data = await sendTweetRequest(replied_tweet_id);
                setRepliedTweetData(data);
                console.log("これがrepliedtweetの内容です",data)
            } catch (error) {
                console.error("Error fetching repliedtweet data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRepliedTweetData();
    }, [replied_tweet_id]);

    return (
        <div className="replied-tweet-container">
            {loading && 
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            }
            {repliedTweetData && (
                <div>
                    <p className="tweet-user">{repliedTweetData.user_name}</p>
                    <p className='tweet-content'>{repliedTweetData.content}</p>
                    <p className='tweet-time'>{new Date(repliedTweetData.created_at).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};


export const ReplyTweetList: React.FC<{ replied_tweet_id: number, user_id: number | undefined}> = ({ replied_tweet_id ,user_id})  => {
    const [selectedTweetID, setSelectedTweetID] = useState<number | null>(null);
    const [replyTweetData, setReplyTweetData] = useState<TweetData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleTweetClick = (tweet: TweetData | undefined) => {
        navigate('/tweetpage', {state:{tweet}});
    };
    useEffect(() => {
        const sendReplyTweetListRequest = async () => {
            setLoading(true);
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/replytweet" , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ replied_tweet_id: replied_tweet_id}),
                });
                if (!response.ok) {
                    throw new Error("Failed to send replytweetlist request");
                }
                const replyTweetData :[TweetData] = await response.json();
                setReplyTweetData(replyTweetData);
                console.log("replytweetlist sent successfully",replyTweetData);
            }catch (error){
                console.error("Error sending replytweetlist request", error);
            }finally{
                setLoading(false);
        }
    };
        sendReplyTweetListRequest();
    },[replied_tweet_id]);
    const toggleReplyView = (tweetID: number) => {
        if (selectedTweetID === tweetID) {
            setSelectedTweetID(null);
        } else {
            setSelectedTweetID(tweetID);
        }
    };
    
    return (
        <div className='reply-container'>
            {loading && 
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            }
            {replyTweetData && (
                replyTweetData.map((tweet) => (
                    <div style={{ padding: '10px', borderBottom: '1px solid #e1e1e1', backgroundColor: 'transparent' }}>
                        <div key={tweet.tweet_id} className='tweet-container' onClick={(e) => { e.stopPropagation(); handleTweetClick(tweet) }}>
                            <p className='tweet-user'>{tweet.user_name}</p>
                            <p className='tweet-content'>{tweet.content}</p>
                            <p className='tweet-time'>{new Date(tweet.created_at).toLocaleString()}</p>
                            <div className='button-container'>
                                <ReplyButton sender_user_id = {user_id} tweet = {tweet}/> 
                                <ValuationButton sender_user_id = {user_id} tweet = {tweet}/>
                                <ReTweetButton sender_user_id = {user_id} tweet = {tweet}/>
                            </div>
                        </div>
                        {tweet.replycount > 0 && (
                        <div>
                        <button className='viewReply-button' onClick={(e) => { e.stopPropagation(); toggleReplyView(tweet.tweet_id); }}>
                            {selectedTweetID === tweet.tweet_id ? '返信を閉じる' : '返信を見る'}
                        </button>
                            {selectedTweetID === tweet.tweet_id && <ReplyTweetList replied_tweet_id={selectedTweetID} user_id={user_id}/>}
                        </div>
                        )}
                            </div>
                ))
            )}
        </div>
        );
    };

