import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/Banner.css'
import Challenges from '../components/Challenges';
import Notifications from '../components/Notifications';
import myImage from '../images/forest.jpg';

function ChallengesPage() {
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
                    <DataInput/>
                    <DashboardButton />
                    <SignOut/>
                </div>
            </header>

            <div className="banner">
                <img className='banner-img' src={myImage}/>
            </div>
            
            {username && <Challenges username={username} />}
        </div>
    );
}

function DataInput() {
    const navigate = useNavigate();

    return (
      <button className='button-outlined' onClick={() => navigate('/datainput')}>
        Data Entry
      </button>
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

export default ChallengesPage;