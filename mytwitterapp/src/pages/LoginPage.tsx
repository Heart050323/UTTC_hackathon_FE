import React from 'react';
import LoginForm from '../components/Auth/Login';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <LoginForm />
      <p>アカウントをお持ちでない方は<Link to="/register">こちら</Link>
      </p>
    </div>
  );
};

export default LoginPage;
