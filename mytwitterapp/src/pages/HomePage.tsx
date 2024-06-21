import React, { useEffect, useState } from 'react';
import { HomePageProps } from '../types';
import { TweetList } from '../components/Tweet/TweetList';
import LogoutForm from '../components/Auth/Logout';
import { Link } from 'react-router-dom';
import { FaPlus, FaTwitter } from 'react-icons/fa';
import './HomePage.css';

const HomePage: React.FC<HomePageProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;
    let lastTimestamp = performance.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTimestamp = performance.now();
      const scrollDelta = currentScrollY - lastScrollY;
      const timeDelta = currentTimestamp - lastTimestamp;

      const speed = Math.abs(scrollDelta / timeDelta) * 1000; // pixels per second

      // Check if we're at the top and scrolling fast
      if (currentScrollY === 0 && speed > 1000) { // Adjust speed threshold as needed
        setLoading(true);
        // Simulate a fetch call
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Adjust the time as needed
      }

      lastScrollY = currentScrollY;
      lastTimestamp = currentTimestamp;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <div className="header">
        <div className="header-left">
          {data && (
            <div>
              <p className="user-name">Logged in as: {data.user_name}</p>
            </div>
          )}
        </div>
        <div className="header-center">
          <FaTwitter size={40} className="twitter-icon" />
        </div>
        <div className="header-right">
          <LogoutForm />
          <Link to="/post" className="new-tweet-button">
            <FaPlus />
          </Link>
        </div>
      </div>
      <div className="content">
        <TweetList user_id={data?.user_id} />
      </div>
      {loading && (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
