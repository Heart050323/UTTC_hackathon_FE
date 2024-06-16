import React, { useEffect,useState } from 'react';
import {HomePageProps, UserInfo} from '../types';
import {TweetList} from '../components/Tweet/TweetList'
import LogoutForm from '../components/Auth/Logout'
import { Link } from 'react-router-dom';

const HomePage: React.FC<HomePageProps> = ({data}) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      {loading && <p>Loading...</p>}
      {data && (
        <div>
          <p>Logged in as: {data.user_name}</p>
        </div>
      )}
      <br></br><TweetList user_id = {data?.user_id}/>
      <LogoutForm /><Link to='/post'>New Tweet</Link>
    </div>
  );
};
export default HomePage;
