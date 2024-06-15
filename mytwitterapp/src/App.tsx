import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import {fireAuth} from './components/Auth/FirebaseConfig';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
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
      <Route path="/" element = {<HomePage email = {email}/>} />
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
