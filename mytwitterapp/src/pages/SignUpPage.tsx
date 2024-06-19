import React from 'react';
import RegisterForm from '../components/Auth/SignUp';
import { Link } from 'react-router-dom';
import './SignUpPage.css';
const SignUpPage: React.FC = () => {
  return (
    <div className='signup-page'>
      <div className='signup-container'>
        <h1 className='app-title'>My Twitter</h1>
        <RegisterForm/>
        <p className='login-link'>既にアカウントをお持ちの方は<Link to ='/login'>こちら</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
