import React, {useState} from 'react';
import { PostPageProps } from '../../types';
 
const TweetForm :React.FC<PostPageProps> = ({data}) => { 
    const [senderUserID,setSenderUserID] = useState<number>(0);
    const [content, setContent] = useState<string>('');
    const [repliedTweetID, setRepliedTweetID] = useState<number>(0);
    const [reTweetID, setReTweetID] = useState<number>(0);
    const [error, setError] = useState<string>('');

    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try{
            await PostRequest(senderUserID, content, repliedTweetID,reTweetID);
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
        <div>
            {data && (
        <div>
          <p>Logged in as: {data.user_name}</p>
        </div>
      )}
            <form onSubmit={handlePost}>
                <div>
                    <textarea onChange={(e) => setContent(e.target.value)} required></textarea>
                    <button type = "submit">投稿</button>
                </div>
            </form>
        </div>
    );
};
export default TweetForm