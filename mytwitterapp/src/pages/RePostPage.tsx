import React, {useState} from 'react';
import {ReTweetForm} from '../components/Tweet/TweetForm'
import { RePostPageProps ,TweetData } from '../types';
import './PostPage.css';
import { useNavigate,useLocation, Link} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
const RePostPage :React.FC<RePostPageProps> = ({ data }) => {
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
            <ReTweetForm data = {data} tweet = {tweet}/>
        </div>
    );
};
export default RePostPage