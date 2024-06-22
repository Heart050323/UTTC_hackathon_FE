import React, { useState, useEffect } from 'react';
import { fireAuth } from './FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { UserInfo } from '../../types';
const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [data, setData] = useState<UserInfo | null>(null);
  const navigate = useNavigate();
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await fireAuth.createUserWithEmailAndPassword(email, password);
      alert('Account created successfully!');
      await sendRegisterRequest(email, username);
      const userData = await fetchUserInfo(email);
      setData(userData);
      navigate('/',{ state: { userData } })
      ResetForm();
    } catch (error) {
      setError('Failed to create account. Please check the information and try again.');
    }
  };
  const sendRegisterRequest = async (email:string , username:string) => {
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/register" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, user_name:username}),
        });
        if (!response.ok) {
            throw new Error("Failed to send register request");
        }
        console.log("register request sent successfully");
    }catch (error){
        console.error("Error sending register request")
    }
  };
  const fetchUserInfo = async (email: string) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/userinfo", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        throw new Error("Failed to send userinfo request");
      }
      const data: UserInfo = await response.json();
      console.log("User info retrieved successfully", data);
      return data;
    } catch (error) {
      console.error("Error fetching user info", error);
      return null;
    }
  };
  const ResetForm = () => {
    setEmail('');
    setPassword('');
  }
  return (
    <div className='form'>
      <h2>新規登録</h2>
      <form onSubmit={handleRegister}>
        <div className='form-group'>
          <label>新規メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>新規パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>ユーザーネーム:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {error && <p className='error-message'>{error}</p>}
        <button type="submit" className='Auth-button'>登録</button>
      </form>
    </div>
  );
};

export default RegisterForm;
