import { useState, useEffect } from "react";
import { fireAuth } from "./FirebaseConfig";

const URL :string = "http://localhost:8080"
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
      await sendAuthRequest(email);
      ResetForm();
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
    }
  };
  const sendAuthRequest = async (email:string) => {
    try {
        const response = await fetch(URL + "/auth" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email}),
        });
        if (!response.ok) {
            throw new Error("FAiled to send auth request");
        }
        const data = await response.json();
        console.log("Auth request sent successfully",data);
    }catch (error){
        console.error("Error sending auth request", error)
    }
  };
  const handleLogout = async () => {
    try {
      await fireAuth.signOut();
      setLoggedInEmail(null);
      alert('Logged out successfully!');
      ResetForm();
    } catch (error) {
      setError('Failed to log out. Please try again.');
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
      <button onClick={handleLogout}>ログアウト</button>
      {loggedInEmail && <p>{loggedInEmail} がログインしました。</p>}
    </div>
  );
};
export default LoginForm