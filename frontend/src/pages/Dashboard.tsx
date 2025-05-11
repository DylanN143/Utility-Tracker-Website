import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import '../components/Banner.css'
import '../components/DataDisplay.css'
import ElectricityChart from '../components/ElectricityChart';
import WaterChart from '../components/WaterChart';
import GasChart from '../components/GasChart';
import myImage from '../images/forest.jpg';
import axios from 'axios';

function Dashboard() {
    const [username, setUsername] = useState("");
    const [notificationFreq, setNotificationFreq] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [refreshKey, setRefreshKey] = useState(0); // For triggering refresh of all charts
    const navigate = useNavigate();
    
    // Function to refresh all charts at once
    const refreshAllCharts = () => {
        setRefreshKey(prev => prev + 1);
    };
    
    // Check if user is logged in
    useEffect(() => {
        const loggedInUsername = sessionStorage.getItem('username');
        if (!loggedInUsername) {
            navigate('/login');
            return;
        }
        setUsername(loggedInUsername);
    }, [navigate]);

    const handleFreqChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNotificationFreq(e.target.value);
        const updateSetings = {
            reqID: 3, // UPDATE_NOTIFICATION_FREQ
            notificationFreq: e.target.value,
            username: username
        };
            
        const response = await axios.post('http://localhost:8080/Backend/Backend', updateSetings);
        console.log("Response:", response);
    };

    const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNotificationType(e.target.value);
        const updateSetings = {
            reqID: 4, // UPDATE_NOTIFICATION_TYPE
            notificationType: e.target.value,
            username: username
        };
            
        const response = await axios.post('http://localhost:8080/Backend/Backend', updateSetings);
        console.log("Response:", response);
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
                
                {username && (
                    <div className="logged-in-user">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                        {username}
                    </div>
                )}
                
                <div>
                    <DataInput/>
                    <HomeButton/>
                    <SignOut/>
                </div>
            </header>

            <div className="banner">
                <img className='banner-img' src={myImage}/>
            </div>

            <div className='dropdown-area'>
                <div className='dropdown'>
                    <label htmlFor='freq'>Notification Frequency: </label>
                    <select id='freq' value={notificationFreq} onChange={handleFreqChange}>
                        <option value="">--Select--</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <div className='dropdown'>
                    <label htmlFor="type">Notification Type: </label>
                    <select id="type" value={notificationType} onChange={handleTypeChange}>
                        <option value="">--Select--</option>
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                    </select>
                </div>
            </div>
            
            <div className='display-info'>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%', 
                    padding: '0 1rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 style={{ color: 'white' }}>Your Utility Usage</h2>
                        <button 
                            onClick={refreshAllCharts} 
                            style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                border: 'none',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>↻</span> Refresh
                        </button>
                    </div>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>
                        <p>Data shown for the last 7 days</p>
                    </div>
                </div>
                
                <div className='display-card'>
                    <h3>Latest Electricity Usage</h3>
                    <ElectricityChart refreshKey={refreshKey} />
                </div>
                <div className='display-card'>
                    <h3>Latest Water Usage</h3>
                    <WaterChart refreshKey={refreshKey} />
                </div>
                <div className='display-card'>
                    <h3>Latest Gas Usage</h3>
                    <GasChart refreshKey={refreshKey} />
                </div>
            </div>
        </div>
      );
}

function HomeButton() {
  const navigate = useNavigate();

  // Navigate to home without signing out
  const goToHome = () => {
    navigate('/dashboard');
  };

  return (
    <button className='button-outlined' onClick={goToHome}>
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

function DataInput() {
    const navigate = useNavigate();

    return (
      <button className='button-outlined' onClick={() => navigate('/datainput')}>
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
        </svg> */}
          Data Entry
      </button>
    );
}

export default Dashboard