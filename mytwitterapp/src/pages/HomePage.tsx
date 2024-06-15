import React from 'react';
import {HomePageProps} from '../types';
import LogoutForm from '../components/Auth/Logout'
const HomePage: React.FC<HomePageProps> = ({email}) => {
  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      {email && <p>Logged in as: {email}</p>}
      <LogoutForm/>
    </div>
  );
};

export default HomePage;
