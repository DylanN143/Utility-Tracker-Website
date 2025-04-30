import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import InputBox from '../components/InputBox';
import axios, { AxiosError } from 'axios'

function SignUp() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Email:", email);
      console.log("Username:", username);
      console.log("Password:", password);

      // REQUIRED
      const headers = {"Content-Type": "application/json"}

      try 
      {
        // Log attempt for debugging
        console.log("Attempting to sign up with:", {email, username, password});
        
        // Can also use the url: 
        // `http://localhost:8080/Backend/Backend?reqID=1&email=${email}&username=${username}&password=${password}`

        // Add better error handling and logging
        const sendingInfo = await axios.post(
          `http://localhost:8081/Backend/Backend`, 
          {reqID: 1, email, username, password}, {headers: headers});

        console.log("Signup response:", sendingInfo);
        
        // Check if response was successful
        if (sendingInfo.data && sendingInfo.data.success) {
          console.log("Successful signup");
          // Store username in session
          sessionStorage.setItem('username', username);
          // Navigate to dashboard after successful signup
          navigate('/dashboard');
        } else {
          console.log("Signup failed:", sendingInfo.data);
          setError("Signup failed: " + (sendingInfo.data?.message || "Unknown error"));
          setTimeout(() => setError(""), 3000);
        }
        
        setEmail("");
        setUsername("");
        setPassword("");
      }
      catch (error)
      {
        console.error("Sign up error:", error);
        
        // Type assertion for Axios error
        const axiosError = error as AxiosError;
        
        // Check if it's an Axios error with a response
        if (axiosError.response) {
          console.error("Error response:", axiosError.response.data);
          // Use type assertion to handle unknown data structure
          const responseData = axiosError.response.data as any;
          setError(`Sign up error: ${axiosError.response.status} - ${responseData?.message || 'Server error'}`);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error("No response received:", axiosError.request);
          setError("Network error: No response from server. Is the backend running?");
        } else {
          // Something happened in setting up the request
          setError("Something went wrong with the sign up: " + axiosError.message);
        }

        // 5 seconds
        setTimeout(() => 
        {
          setError("");
        }, 5000) 
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
            <h1>Create Account</h1>
            <p>Sign up to start tracking your utility usage and save money.</p>
        </div>
        
        <form onSubmit={submit} className='input'>
            <div className="input-section">
                <div className="input-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    Account Information
                </div>
                
                <InputBox
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                    }
                />
                
                <InputBox
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
                    required
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                        </svg>
                    }
                />
            </div>
            
            {error && <div className="form-message error-message">{error}</div>}
            
            <SubmitButton/>
            
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                <p>Already have an account? 
                    <span 
                        style={{ 
                            color: 'var(--accent-color)', 
                            marginLeft: '5px', 
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </span>
                </p>
            </div>
        </form>
    </div>
  );
}

function SubmitButton() {
    const navigate = useNavigate();
    
    return (
        <button type="submit" className='button'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Create Account
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

export default SignUp