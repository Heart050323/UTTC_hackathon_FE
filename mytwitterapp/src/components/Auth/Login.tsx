import { useState, useEffect } from "react";
import { fireAuth } from "./FirebaseConfig";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await fireAuth.signInWithEmailAndPassword(email, password);
      alert('Logged in successfully!');
      ResetForm();
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
    }
  };
  const ResetForm = () => {
    setEmail('');
    setPassword('');
  }
  useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged((user :any) => {
      if (user) {
        setLoggedInEmail(user.email);
      } else {
        setLoggedInEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
      {loggedInEmail && <p>{loggedInEmail} がログインしました。</p>}
    </div>
  );
};
export default LoginForm