import React, {useState} from 'react';
import {TweetForm} from '../components/Tweet/TweetForm'
import { PostPageProps } from '../types';
import './PostPage.css';
import { useNavigate ,Link} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
const PostPage :React.FC<PostPageProps> = ({data}) => { 
    const navigate = useNavigate();
    return(
        <div className='post-page-container'>
            <div className='post-page-header'>
                <Link to="/" className="home">
                    <FaArrowLeft className="icon" />
                </Link>
            </div>
            <TweetForm data = {data}/>
        </div>
    );
};
export default PostPage