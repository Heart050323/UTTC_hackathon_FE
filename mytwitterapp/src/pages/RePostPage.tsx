import React, {useState} from 'react';
import {ReTweetForm} from '../components/Tweet/TweetForm'
import { RePostPageProps ,TweetData } from '../types';
import './PostPage.css';
import { useNavigate,useLocation } from 'react-router-dom';
const RePostPage :React.FC<RePostPageProps> = ({ data }) => {
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
            <ReTweetForm data = {data} tweet = {tweet}/>
        </div>
    );
};
export default RePostPage