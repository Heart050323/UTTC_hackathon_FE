import React, {useState} from 'react';
import {TweetForm} from '../components/Tweet/TweetForm'
import { PostPageProps } from '../types';
import './PostPage.css';
import { useNavigate } from 'react-router-dom';
const PostPage :React.FC<PostPageProps> = ({data}) => { 
    const navigate = useNavigate();
    return(
        <div className='post-page-container'>
            <div className='post-page-header'>
                <button className='header-button cancel-button' onClick={() => navigate('/')}>
                    キャンセル
                </button>
            </div>
            <TweetForm data = {data}/>
        </div>
    );
};
export default PostPage