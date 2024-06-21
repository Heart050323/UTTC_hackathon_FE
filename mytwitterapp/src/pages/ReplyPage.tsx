import React, {useState} from 'react';
import {ReplyTweetForm} from '../components/Tweet/TweetForm'
import { ReplyPageProps ,TweetData } from '../types';
import './PostPage.css';
import { useNavigate,useLocation } from 'react-router-dom';
const ReplyPage :React.FC<ReplyPageProps> = ({ data }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tweet } = location.state as { tweet: TweetData };
    return(
        <div className='post-page-container'>
            <div className='post-page-header'>
                <button className='header-button cancel-button' onClick={() => navigate('/')}>
                    キャンセル
                </button>
            </div>
            <ReplyTweetForm data = {data} tweet = {tweet}/>
        </div>
    );
};
export default ReplyPage