import React, {useState} from 'react';
import TweetForm from '../components/Tweet/TweetForm'
import { PostPageProps } from '../types';

const PostPage :React.FC<PostPageProps> = ({data}) => { 
    return(
        <div>
            <p>tweetを投稿</p>
            <TweetForm data = {data}/>
        </div>
    );
};
export default PostPage