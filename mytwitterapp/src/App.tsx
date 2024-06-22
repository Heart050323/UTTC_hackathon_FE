import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, useNavigate,useLocation} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import {fireAuth} from './components/Auth/FirebaseConfig';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import RePostPage from './pages/RePostPage';
import ReplyPage from './pages/ReplyPage'
import { TweetPage } from './pages/TweetPage';
import { UserInfo } from './types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'
import { ProfilePage } from './pages/ProfilePage';
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<UserInfo | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const sendUserInfoRequest = async (email:string | null) => {
      setLoading(true);
      try {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/userinfo" , {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: email}),
          });
          if (!response.ok) {
              throw new Error("Failed to send userinfo request");
          }
          const data :UserInfo = await response.json();
          setData(data);
          console.log("Past tweet request sent successfully",data);
      }catch (error){
          console.error("Error sending past tweet request", error);
      }finally{
        setLoading(false);
      }
    };

    if (email) {
      sendUserInfoRequest(email);
    }
  },[email]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        navigate ('/');
      }else{
        setUser(null);
        setEmail(null);
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  },[]);

  if (loading) {
    return    <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              </div>
  }
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={300}
      >
        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/" element={<HomePage data={data} />} />
          <Route path="/post" element={<PostPage data={data} />} />
          <Route path="/repost" element={<RePostPage data={data} />} />
          <Route path="/reply" element={<ReplyPage data={data} />} />
          <Route path="/tweetpage" element={<TweetPage data={data} />} />
          <Route path='/profilepage' element={<ProfilePage data={data}/>}/>
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};
const Root: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;
