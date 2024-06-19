import { useState, useEffect } from "react";
import { fireAuth } from "./FirebaseConfig";

const LogoutForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
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
    };
    return (
        <button className="button" onClick={handleLogout}>ログアウト</button>
    );
};
export default LogoutForm