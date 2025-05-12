import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/Banner.css'
import News from '../components/News';
import Notifications from '../components/Notifications';
import myImage from '../images/forest.jpg';

function NewsPage() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    
    // Check if user is logged in
    useEffect(() => {
        const loggedInUsername = sessionStorage.getItem('username');
        if (!loggedInUsername) {
            navigate('/login');
            return;
        }
        setUsername(loggedInUsername);
    }, [navigate]);

    return (
        <div className='header'>
            <header>
                <div className="header-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"/>
                    </svg>
                    <p>EcoTrack</p>
                </div>
                
                {username && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Notifications component */}
                        <Notifications username={username} />
                        
                        <div className="logged-in-user">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                            {username}
                        </div>
                    </div>
                )}
                
                <div>
                    <DashboardButton/>
                    <ChallengesButton/>
                    <CommunityButton/>
                    <DataInputButton/>
                    <SignOut/>
                </div>
            </header>

            <div className="banner">
                <img className='banner-img' src={myImage}/>
            </div>
            
            {username && <News />}
        </div>
    );
}

function DashboardButton() {
    const navigate = useNavigate();
  
    return (
      <button className='button-outlined' onClick={() => navigate('/dashboard')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
          </svg>
          Dashboard
      </button>
    );
}

function ChallengesButton() {
    const navigate = useNavigate();
  
    return (
      <button className='button-outlined' onClick={() => navigate('/challenges')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zm-2 2v1c0 1.65-1.35 3-3 3s-3-1.35-3-3V5h6v2zm-10 1V7h2v3c0 1.1.9 2 2 2v2c-2.21 0-4-1.79-4-4zm14 0c0 2.21-1.79 4-4 4v-2c1.1 0 2-.9 2-2V7h2v1z"/>
          </svg>
          Challenges
      </button>
    );
}

function CommunityButton() {
    const navigate = useNavigate();
  
    return (
      <button className='button-outlined' onClick={() => navigate('/community')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
          </svg>
          Community
      </button>
    );
}

function DataInputButton() {
    const navigate = useNavigate();

    return (
      <button className='button-outlined' onClick={() => navigate('/datainput')}>
        Data Entry
      </button>
    );
}

function SignOut() {
    const navigate = useNavigate();
    
    const handleSignOut = () => {
        sessionStorage.removeItem('username');
        navigate('/home');
    };
  
    return (
      <button className='button-outlined' onClick={handleSignOut}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Sign Out
      </button>
    );
}

export default NewsPage;