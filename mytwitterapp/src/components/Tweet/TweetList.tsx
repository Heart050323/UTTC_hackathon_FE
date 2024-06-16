import React, { useEffect,useState } from 'react';
import {TweetData} from '../../types'
 

export const TweetList: React.FC = ()=> {
    const [tweetdata, setTweetData] = useState<TweetData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedTweetID, setSelectedTweetID] = useState<number | null>(null);
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
                console.log("tweetlist sent successfully",tweetdata);
            }catch (error){
                console.error("Error sending tweetlist request", error);
            }finally{
                setLoading(false);
        }
    };
        sendTweetListRequest();
    },[]);
    return (
        <div>
            {loading && <p>Loading...</p>}
            {tweetdata && (
                tweetdata.map((tweet) => (
                    <div key={tweet.tweet_id} style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                        <p>User: {tweet.user_name}</p>
                        <p>Content: {tweet.content}</p>
                        <p>{new Date(tweet.created_at).toLocaleString()}</p>
                        <button onClick={() => setSelectedTweetID(tweet.tweet_id)}>View Reply</button>
                    </div>
                ))
            )}
            {selectedTweetID && <ReplyTweetList replied_tweet_id = {selectedTweetID}/>}
        </div>
        );
    };

const ReplyTweetList: React.FC<{ replied_tweet_id: number }> = ({ replied_tweet_id })  => {
    const [replyTweetData, setReplyTweetData] = useState<TweetData[] | null>(null);
    const [loading, setLoading] = useState(false);
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
                    throw new Error("Failed to send reolytweetlist request");
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
    return (
        <div>
            {loading && <p>Loading...</p>}
            {replyTweetData && replyTweetData.length > 0 ? (
                replyTweetData.map((tweet) => (
                    <div key={tweet.tweet_id}>
                        <p>User: {tweet.user_name}</p>
                        <p>Content: {tweet.content}</p>
                        <p>{new Date(tweet.created_at).toLocaleString()}</p>
                        {tweet.replied_tweet_id && <button onClick={() => ReplyTweetList({replied_tweet_id: tweet.replied_tweet_id})}>View Reply</button>}
                    </div>
                ))
            ) : (<p></p>)}
        </div>
        );
    };