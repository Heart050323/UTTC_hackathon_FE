import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import {fireAuth} from './components/Auth/FirebaseConfig';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import { UserInfo } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<UserInfo | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const sendPastTweetRequest = async (email:string | null) => {
      setLoading(true);
      try {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/pasttweet" , {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: email}),
          });
          if (!response.ok) {
              throw new Error("FAiled to send past tweet request");
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
      sendPastTweetRequest(email);
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
    return <div>Loading...</div>
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/" element = {<HomePage data = {data}/>} />
      <Route path="/post" element = {<PostPage data = {data}/>} />
    </Routes>
  );
};
const Root: React.FC = () => (
  <BrowserRouter>
    <h1>Twitter</h1>
    <App />
  </BrowserRouter>
);

export default Root;
