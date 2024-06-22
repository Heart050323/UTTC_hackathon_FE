import React, {useState, useEffect} from 'react';
import { PostPageProps, ReTweetProps } from '../../types';
import { useNavigate } from 'react-router-dom';
import './TweetFormStyles.css'
import { ReTweetedTweet, RepliedTweet } from './TweetList';
export const TweetForm :React.FC<PostPageProps> = ({data}) => { 
    const [senderUserID,setSenderUserID] = useState<number>(0);
    const [content, setContent] = useState<string>('');
    const [repliedTweetID, setRepliedTweetID] = useState<number>(0);
    const [reTweetID, setReTweetID] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try{
            await PostRequest(senderUserID, content, repliedTweetID,reTweetID);
            alert("Tweetを投稿しました。");
            navigate('/')
        }catch (error) {
            setError('Failed to Post')
        }
    };
    const PostRequest = async (senderUserID:number | undefined, content:string, repliedTweetID:number,reTweetID:number) => {
        senderUserID = data?.user_id
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/post" , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sender_user_id:senderUserID , content:content, replied_tweet_id : repliedTweetID, re_tweet_id : reTweetID})
            });
            if (!response.ok) {
                throw new Error("Failed to Post request");
            }
            console.log("post request sent successfully")
        }catch (error){
            console.error("Error sending post request")
        };
    };
    return(
        <div className="tweet-form-container">
        <form id="tweet-form" onSubmit={handlePost}>
            <div className="tweet-form-textarea">
            {data && (
                <div className="tweet-form-user">
                <p>{data.user_name}</p>
                </div>
            )}
            <div className="tweet-form-group">
                <textarea
                placeholder="What's happening?"
                onChange={(e) => setContent(e.target.value)}
                required
                ></textarea>
            </div>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="post-button">
            <button type="submit">投稿</button>
            </div>
        </form>
    </div>
    );
};

export const ReplyTweetForm :React.FC<ReTweetProps> = ({data,tweet} ) => { 
    const [senderUserID,setSenderUserID] = useState<number | undefined>(0);
    const [content, setContent] = useState<string>('');
    const [repliedTweetID, setRepliedTweetID] = useState<number>(0);
    const [reTweetID, setReTweetID] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    useEffect(() => {
        setRepliedTweetID(tweet.tweet_id);
        setSenderUserID(data?.user_id);
    }, [data?.user_id, tweet.tweet_id]);
    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try{
            await PostRequest(senderUserID, content, repliedTweetID,reTweetID);
            alert("replyを投稿しました。");
            navigate('/')
        }catch (error) {
            setError('Failed to reply')
        }
    };
    const PostRequest = async (senderUserID:number | undefined, content:string, repliedTweetID:number,reTweetID:number) => {
        senderUserID = data?.user_id
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/post" , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sender_user_id:senderUserID , content:content, replied_tweet_id : repliedTweetID, re_tweet_id : reTweetID})
            });
            if (!response.ok) {
                throw new Error("Failed to Post request");
            }
            console.log("post request sent successfully")
        }catch (error){
            console.error("Error sending post request")
        };
    };
    return(
        <div className="reply-tweet-form-container">
            <RepliedTweet replied_tweet_id={tweet.tweet_id} user_id={tweet.user_id}/>
            <form id="reply-tweet-form" onSubmit={handlePost}>
                <div className="reply-tweet-form-textarea">
                {data && (
                    <div className="reply-tweet-form-user">
                    <p>{data.user_name}</p>
                    </div>
                )}
                <div className="reply-tweet-form-group">
                    <textarea
                    placeholder="What's happening?"
                    onChange={(e) => setContent(e.target.value)}
                    required
                    ></textarea>
                </div>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="post-button">
                <button type="submit">投稿</button>
                </div>
            </form>
        </div>
    );
};
export const ReTweetForm :React.FC<ReTweetProps> = ({data,tweet} ) => { 
    const [senderUserID,setSenderUserID] = useState<number | undefined>(0);
    const [content, setContent] = useState<string>('');
    const [repliedTweetID, setRepliedTweetID] = useState<number>(0);
    const [reTweetID, setReTweetID] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    useEffect(() => {
        setReTweetID(tweet.tweet_id);
        setSenderUserID(data?.user_id);
    }, [data?.user_id, tweet.tweet_id]);
    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try{
            await PostRequest(senderUserID, content, repliedTweetID,reTweetID);
            alert("Tweetを投稿しました。");
            navigate('/')
        }catch (error) {
            setError('Failed to Post')
        }
    };
    const PostRequest = async (senderUserID:number | undefined, content:string, repliedTweetID:number,reTweetID:number) => {
        senderUserID = data?.user_id
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/post" , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sender_user_id:senderUserID , content:content, replied_tweet_id : repliedTweetID, re_tweet_id : reTweetID})
            });
            if (!response.ok) {
                throw new Error("Failed to Post request");
            }
            console.log("post request sent successfully")
        }catch (error){
            console.error("Error sending post request")
        };
    };
    return(
        <div className="retweet-form-container">
            <form id="retweet-form" onSubmit={handlePost}>
                <div className="retweet-form-textarea">
                {data && (
                    <div className="retweet-form-user">
                    <p>{data.user_name}</p>
                    </div>
                )}
                <div className="retweet-form-group">
                    <textarea
                    placeholder="What's happening?"
                    onChange={(e) => setContent(e.target.value)}
                    required
                    ></textarea>
                </div>
                <div className='retweetedtweet'>
                    <ReTweetedTweet re_tweet_id={tweet.tweet_id} user_id={data?.user_id}/>
                </div>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="post-button">
                <button type="submit">投稿</button>
                </div>
            </form>
        </div>
    );
};