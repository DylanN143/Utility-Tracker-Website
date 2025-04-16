import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import InputBox from '../components/InputBox';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const url = `http://localhost:8080/Backend/Backend?reqID=1&username=${username}&password=${password}`;
      const response = await axios.get(url);
      
      console.log("Login response:", response.data);
      
      if (response.data.PASSWORD_CHECK === true) {
        // Store username in sessionStorage for use in other components
        sessionStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='header'>
        <header>
            <div className="header-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"/>
                </svg>
                <p>EcoTrack</p>
            </div>
            <HomeButton/>
        </header>
        
        <div className="header-welcome">
            <h1>Welcome Back</h1>
            <p>Login to your account to track and manage your utility usage.</p>
        </div>
        
        <form onSubmit={submit} className='input'>
            <div className="input-section">
                <div className="input-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    Account Login
                </div>
                
                <InputBox
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    }
                />
                
                <InputBox
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                        </svg>
                    }
                />
            </div>
            
            {error && <div className="form-message error-message">{error}</div>}
            
            <LoginButton isLoading={isLoading} />
            
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                <p>Don't have an account? 
                    <span 
                        style={{ 
                            color: 'var(--accent-color)', 
                            marginLeft: '5px', 
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </form>
    </div>
  );
}

function LoginButton({ isLoading }: { isLoading?: boolean }) {
  return (
      <button type="submit" className='button' disabled={isLoading}>
          {isLoading ? (
              <span>Logging in...</span>
          ) : (
              <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                  </svg>
                  Login
              </>
          )}
      </button>
  );
}

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button className='button-outlined' onClick={() => navigate('/home')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
        </svg>
        Home
    </button>
  );
}

export default Login