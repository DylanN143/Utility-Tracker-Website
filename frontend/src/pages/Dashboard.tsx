import React, { useState, useEffect } from 'react'
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import '../components/Banner.css'
import '../components/DataDisplay.css'
import ElectricityChart from '../components/ElectricityChart';
import WaterChart from '../components/WaterChart';
import GasChart from '../components/GasChart';
import Notifications from '../components/Notifications';
import myImage from '../images/forest.jpg';
import axios from 'axios';
// Import mock data for demo
import { mockNotifications } from '../mockData/userData';

function Dashboard() {
    const [username, setUsername] = useState("");
    const [notificationFreq, setNotificationFreq] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [refreshKey, setRefreshKey] = useState(0); // For triggering refresh of all charts

    // Function to refresh all charts at once
    const refreshAllCharts = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Get username from localStorage (set by AuthLayout)
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleFreqChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNotificationFreq(e.target.value);

        try {
            const updateSetings = {
                reqID: 8, // UPDATE_NOTIFICATION_FREQ
                notificationFreq: e.target.value,
                username: username
            };

            const response = await axios.post('http://localhost:8080/Backend/Backend', updateSetings);
            console.log("Response:", response);
        } catch (err) {
            console.error("Error updating notification frequency:", err);
        }
    };

    const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNotificationType(e.target.value);

        try {
            const updateSetings = {
                reqID: 9, // UPDATE_NOTIFICATION_TYPE
                notificationType: e.target.value,
                username: username
            };

            const response = await axios.post('http://localhost:8080/Backend/Backend', updateSetings);
            console.log("Response:", response);
        } catch (err) {
            console.error("Error updating notification type:", err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="banner">
                <img className='banner-img' src={myImage} alt="Forest landscape"/>
            </div>

            <div className='dropdown-area'>
                <div className='dropdown'>
                    <label htmlFor='freq'>Notification Frequency:</label>
                    <select id='freq' value={notificationFreq} onChange={handleFreqChange}>
                        <option value="">--Select--</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <div className='dropdown'>
                    <label htmlFor="type">Notification Type:</label>
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

export default Dashboard