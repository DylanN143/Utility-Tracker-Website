import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored username in localStorage (for demo purposes)
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no stored username, user is not authenticated
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');

    // Redirect to home page
    navigate('/home');
  };

  // If username is empty (not authenticated), don't render anything
  // Navigation will happen in the useEffect
  if (!username) {
    return null;
  }

  return (
    <div className="auth-layout">
      <NavBar username={username} onLogout={handleLogout} />
      <div className="auth-content">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;