import React from 'react';
import RegisterForm from '../components/Auth/SignUp';
import { Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <RegisterForm/>
      <p>既にアカウントをお持ちの方は<Link to ='/login'>こちら</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
