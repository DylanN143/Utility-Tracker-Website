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

function Dashboard() {
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
            
            <div className='display-info'>
                <div className='display-card'>
                    <h3>Lastest Electricity Usage</h3>
                    <ElectricityChart />
                </div>
                <div className='display-card'>
                    <h3>Lastest Water Usage</h3>
                    <WaterChart />
                </div>
                <div className='display-card'>
                    <h3>Lastest Gas Usage</h3>
                    <GasChart />
                </div>
            </div>
        </div>
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

function SignOut() {
  
    return (
      <button className='button-outlined' onClick={() => sessionStorage.removeItem('username')}>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
          </svg> */}
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