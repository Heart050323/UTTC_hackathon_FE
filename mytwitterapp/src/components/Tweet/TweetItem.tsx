import { TweetItemProps } from "../../types";
import { useNavigate } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import './TweetItemStyles.css';
import { FaReply,FaRetweet,FaThumbsUp,FaThumbsDown} from 'react-icons/fa';

const postRequest = async (senderUserID: number | undefined, content: string, repliedTweetID: number, reTweetID: number) => {
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/post", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sender_user_id: senderUserID, content: content, replied_tweet_id: repliedTweetID, re_tweet_id: reTweetID })
        });
        if (!response.ok) {
            throw new Error("Failed to Post request");
        }
        console.log("post request sent successfully");
    } catch (error) {
        console.error("Error sending post request", error);
        throw error;
    }
};

export const ReplyButton: React.FC<TweetItemProps> = ({ sender_user_id, tweet }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [senderUserID, setSenderUserID] = useState<number | undefined>(undefined);
    const [content, setContent] = useState<string>('');
    const [repliedTweetID, setRepliedTweetID] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [replycount, setReplycount] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        setReplycount(tweet.replycount);
        setRepliedTweetID(tweet.tweet_id);
        setSenderUserID(sender_user_id);
    }, [sender_user_id, tweet.tweet_id, tweet.replycount]);
    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigate('/reply',{ state: { tweet } });
    };
    return (
        <div>
            <button className="reply-button" onClick={handleButtonClick}>
                <FaReply /> {replycount}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export const ReTweetButton: React.FC<TweetItemProps> = ({ sender_user_id, tweet }) => {
    const [senderUserID, setSenderUserID] = useState<number | undefined>(undefined);
    const [content, setContent] = useState<string>('');
    const [reTweetID, setReTweetID] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [reTweetcount, setReTweetcount] = useState<number>(0);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [reTweetON,setRetweetOn] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        ConfirmRetweet(sender_user_id,tweet.tweet_id)
        setReTweetcount(tweet.re_tweetcount);
        setReTweetID(tweet.tweet_id);
        setSenderUserID(sender_user_id);
    }, [sender_user_id, tweet.tweet_id, tweet.re_tweetcount]);
    const ConfirmRetweet = async (senderUserID: number | undefined, tweetID: number) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/confirmretweet" , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tweet_id : tweetID, sender_user_id: senderUserID })
            });
            if (!response.ok) {
                throw new Error("Failed to ConfirmRetweet request");
            }
            const data  = await response.json();
            const retweeton: number = data.re_tweet_on;
            setRetweetOn(retweeton);
            console.log("Confirm ReTweetOn request sent successfully");
        }catch (error){
            console.error("Error sending RetweetOn request")
        };
    };
    const handleReTweet = async (event: React.MouseEvent) => {
        event.stopPropagation();
        setError('');
        try {
            await postRequest(senderUserID, content, 0, reTweetID);
            alert("ReTweetしました。");
            setContent('');
            navigate('/');
        } catch (error) {
            setError('Failed to Retweet');
        }
    };
    const handleQuoteReTweet = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigate('/repost', { state: { tweet } });
    };
    const toggleOptions = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!reTweetON){
            setShowOptions(!showOptions);
        };
    };
    return (
        <div>
            <button className={`retweet-button ${(reTweetON == 1) ? 'retweeted' : ''}`} onClick={toggleOptions}>
                <FaRetweet /> {reTweetcount}
            </button>
            {showOptions && reTweetON != 1 && (
                <div className="retweet-options">
                    <button onClick={handleReTweet}>リツイート</button>
                    <button onClick={handleQuoteReTweet}>引用リツイート</button>
                    <button onClick={toggleOptions}>キャンセル</button>
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export const ValuationButton: React.FC<TweetItemProps> = ({sender_user_id,tweet})=> {
    const [valuationType,setValuationType] = useState<number | undefined>(0); //この値は役に立っているのかどうか聞いてみる。
    const [likecount, setLikecount] = useState<number>(0);
    const [badcount,  setBadcount ] = useState<number>(0);
    const [processing, setProcessing] = useState<boolean>(false);
    useEffect(() => {
        ConfirmValuationType(sender_user_id, tweet.tweet_id);
        setLikecount(tweet.likecount);
        setBadcount(tweet.badcount);
    }, [sender_user_id, tweet.tweet_id,tweet.likecount,tweet.badcount]);
    const ConfirmValuationType = async (senderUserID: number | undefined, tweetID: number) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/confirmValuationType" , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tweet_id : tweetID, sender_user_id: senderUserID })
            });
            if (!response.ok) {
                throw new Error("Failed to ConfirmValuationType request");
            }
            const data  = await response.json();
            const valuation_type: number | undefined = data.valuation_type;
            setValuationType(valuation_type);
            console.log("Confirm Valuation request sent successfully",valuation_type,data.valuation_type,valuationType);
        }catch (error){
            console.error("Error sending Valuation request")
        };
    };

    const ValuationRequest = async (senderUserID: number | undefined, tweetID: number, valuationType : number | undefined) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/valuation" , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tweet_id : tweetID, sender_user_id: senderUserID, valuation_type: valuationType})
            });
            if (!response.ok) {
                throw new Error("Failed to Valuation request");
            }
            console.log("Valuation request sent successfully valuationTypeはこれになりました",valuationType);
            return valuationType;
        }catch (error){ 
            console.error("Error sending Valuation request",error)
            return null;
        };
    };
    
    const handleGoodButtonClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (processing) return; // 処理中の場合は無視する
        setProcessing(true); // 処理中に設定

        try{
            if (valuationType === 1) {
                // いいねを解除する
                const result = await ValuationRequest(sender_user_id, tweet.tweet_id, -1);
                if (result === -1) {
                    setLikecount(likecount - 1);
                    setValuationType(0);
                }
            } else {
                if (valuationType === 2) {
                    // まずバッド評価を解除
                    const result = await ValuationRequest(sender_user_id, tweet.tweet_id, -2);
                    if (result === -2) {
                        setBadcount(badcount - 1);
                    }
                }
                // 次にいいねを設定
                const result = await ValuationRequest(sender_user_id, tweet.tweet_id, 1);
                if (result === 1) {
                    setLikecount(likecount + 1);
                    setValuationType(1);
                }
            } 
        }catch (error){
            console.error("Error handling Good Button click", error);
        }finally {
            setProcessing(false);
        };
    };

    const handleBadButtonClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (processing) return; // 処理中の場合は無視する

        setProcessing(true); // 処理中に設定
        try{
            if (valuationType === 2) {
                // バッド評価を解除する
                const result = await ValuationRequest(sender_user_id, tweet.tweet_id, -2);
                if (result === -2) {
                    setBadcount(badcount - 1);
                    setValuationType(0);
                }
            } else {
                if (valuationType === 1) {
                    // まずいいねを解除
                    const result = await ValuationRequest(sender_user_id, tweet.tweet_id, -1);
                    if (result === -1) {
                        setLikecount(likecount - 1);
                    }
                }
                // 次にバッド評価を設定
                const result = await ValuationRequest(sender_user_id, tweet.tweet_id, 2);
                if (result === 2) {
                    setBadcount(badcount + 1);
                    setValuationType(2);
                }
            }
        }catch(error) {
            console.error("Error handling Good Button click", error);
        }finally{
            setProcessing(false);
        };
    };
    return (
        <div className="button-container">
            <div className="good-button-container">
                <button onClick={handleGoodButtonClick} className={`good-button ${valuationType === 1 ? 'liked' : ''}`}>
                    <FaThumbsUp/>
                </button>
                {likecount}
            </div>
            <div className="bad-button-container">
                <button onClick={handleBadButtonClick} className={`bad-button ${valuationType === 2 ? 'hated' : ''}`}>
                    <FaThumbsDown/>
                </button>
                {badcount}
            </div>
        </div>
    );
}