import { TweetItemProps } from "../../types";
import { useNavigate } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import './TweetStyles.css';
import { FaReply,FaThumbsUp,FaThumbsDown} from 'react-icons/fa';

export const ReplyButton: React.FC<TweetItemProps> = ({sender_user_id,tweet})=> {
    const [showForm, setShowForm] = useState<boolean>(false);
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
            alert("Replyを投稿しました。");
            setContent('');
            setShowForm(false);
            navigate('/');
        }catch (error) {
            setError('Failed to Post');
        }
    };
    const PostRequest = async (senderUserID:number | undefined, content:string, repliedTweetID:number,reTweetID:number) => {

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
        <div>
            <button className="reply-button" onClick={() => setShowForm(!showForm)}>
                <FaReply/>
            </button>
            {showForm && (
                <form onSubmit={handlePost} className="reply-form">
                    <div>
                        <textarea value = {content} onChange={(e) => setContent(e.target.value)} required></textarea>
                        <button className="send-button" type = "submit">送信</button>
                    </div>
                </form>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export const ValuationButton: React.FC<TweetItemProps> = ({sender_user_id,tweet})=> {
    const [valuationType,setValuationType] = useState<number | undefined>(0); //この値は役に立っているのかどうか聞いてみる。
    const [likecount, setLikecount] = useState<number>(0);
    const [badcount,  setBadcount ] = useState<number>(0);
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
    
    const handleGoodButtonClick = async () => {
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
    };

    const handleBadButtonClick = async () => {
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