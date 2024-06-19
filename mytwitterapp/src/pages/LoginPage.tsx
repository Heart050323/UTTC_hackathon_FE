import React from 'react';
import LoginForm from '../components/Auth/Login';
import { Link } from 'react-router-dom';
import './LoginPage.css';
const LoginPage: React.FC = () => {
  return (
    <div className='login-page'>
      <div className='login-container'>
      <h1 className='app-title'>My Twitter</h1>
      <LoginForm />
      <p className='register-link'>
        アカウントをお持ちでない方は<Link to="/register">こちら</Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;
