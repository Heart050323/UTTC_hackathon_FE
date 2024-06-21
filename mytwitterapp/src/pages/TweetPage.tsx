import { TweetPageProps,TweetData} from "../types";
import { useState,useEffect } from "react";
import { useLocation, Link,useNavigate } from "react-router-dom";
import { ReplyButton,ValuationButton, ReTweetButton } from "../components/Tweet/TweetItem";
import { ReplyTweetList,ReTweetedTweet ,sendTweetRequest} from "../components/Tweet/TweetList";
import './TweetPage.css'
export const TweetPage: React.FC<TweetPageProps> = ({data})=> {
    const location = useLocation();
    const { tweet } = location.state as { tweet: TweetData };
    const [reTweetedTweet, setRetTweetedTweet] = useState<TweetData>(tweet);
    const navigate = useNavigate();
    const handleTweetClick = (tweet: TweetData) => {
        navigate('/tweetpage', {state:{tweet}});
    };

    const fetchReTweetData = async (tweetID: number) => {
        try {
            const data = await sendTweetRequest(tweetID);
            if (data != undefined){
                setRetTweetedTweet(data);
                return data;
            }
        } catch (error) {
            console.error("Error fetching tweet data", error);
        }
    };
    useEffect(() => {
        if (tweet.re_tweet_id !== 0){
            fetchReTweetData(tweet.re_tweet_id);
        }
    },[tweet]);
    
    return(
    <div>
        {tweet.re_tweet_id !== 0 && tweet.content.length > 0 && (
            <div className='tweet-container'>
                <p className="tweet-user">{tweet.user_name}</p>
                <p className='tweet-content'>{tweet.content}</p>
                <p className='tweet-time'>{new Date(tweet.created_at).toLocaleString()}</p>
                <div className='re-tweet-container' onClick={(e) => { e.stopPropagation(); handleTweetClick(reTweetedTweet)}}>
                <ReTweetedTweet re_tweet_id={tweet.re_tweet_id} user_id={data?.user_id} />
                </div>
                <div className="button-container">
                <ReplyButton sender_user_id = {data?.user_id} tweet = {tweet}/> 
                <ValuationButton sender_user_id = {data?.user_id} tweet = {tweet}/>
                <ReTweetButton sender_user_id = {data?.user_id} tweet = {tweet}/>
                </div>
            </div>
        )}
        {tweet.re_tweet_id === 0 && (
            <div className='tweet-container' onClick={() => handleTweetClick(tweet)}>
                <p className="tweet-user">User: {tweet.user_name}</p>
                <p className='tweet-content'>Content: {tweet.content}</p>
                <p className='tweet-time'>{new Date(tweet.created_at).toLocaleString()}</p>
                <div className="button-container">
                <ReplyButton sender_user_id = {data?.user_id} tweet = {tweet}/> 
                <ValuationButton sender_user_id = {data?.user_id} tweet = {tweet}/>
                <ReTweetButton sender_user_id = {data?.user_id} tweet = {tweet}/>
                </div>
            </div>
        )}
        <Link to='/'>ホームへ戻る</Link>
        <div>
        {tweet.replycount > 0 && <ReplyTweetList replied_tweet_id={tweet.tweet_id} user_id={data?.user_id}/>}
        </div>
    </div>
    )
    };