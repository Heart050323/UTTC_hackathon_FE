import { TweetItemProps } from "../../types";
import { useNavigate } from 'react-router-dom';
import React, {useState} from 'react';

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
        senderUserID = sender_user_id;
        repliedTweetID = tweet.tweet_id;

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
            <button onClick={() => setShowForm(!showForm)}>reply</button>
            {showForm && (
                <form onSubmit={handlePost}>
                    <div>
                        <textarea value = {content} onChange={(e) => setContent(e.target.value)} required></textarea>
                        <button type = "submit">送信</button>
                    </div>
                </form>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export const GoodButton: React.FC<TweetItemProps> = ({sender_user_id,tweet})=> {
    return <>GoodButton{sender_user_id && <>{sender_user_id}</>},{tweet && <>{tweet.content}</>}</>
    };