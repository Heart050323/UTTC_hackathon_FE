import React, { useState } from 'react';
import { fireAuth } from './FirebaseConfig';

 
const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await fireAuth.createUserWithEmailAndPassword(email, password);
      alert('Account created successfully!');
      await sendRegisterRequest(email, username);
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
            throw new Error("FAiled to send register request");
        }
        console.log("register request sent successfully");
    }catch (error){
        console.error("Error sending register request")
    }
  };
  const ResetForm = () => {
    setEmail('');
    setPassword('');
  }
  return (
    <div>
      <h2>新規登録</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>新規メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>新規パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ユーザーネーム:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default RegisterForm;
