import React, {useState} from 'react';
import {ReplyTweetForm} from '../components/Tweet/TweetForm'
import { ReplyPageProps ,TweetData } from '../types';
import './PostPage.css';
import { useNavigate,useLocation, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
const ReplyPage :React.FC<ReplyPageProps> = ({ data }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tweet } = location.state as { tweet: TweetData };
    return(
        <div className='post-page-container'>
            <div className='post-page-header'>
            <Link to="/" className="home">
                <FaArrowLeft className="icon" />
            </Link>
            </div>
            <ReplyTweetForm data = {data} tweet = {tweet}/>
        </div>
    );
};
export default ReplyPage