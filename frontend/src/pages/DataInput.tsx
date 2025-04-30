import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import '../components/ErrorMessage.css'
import InputBox from '../components/InputBox';
import axios, { AxiosError } from 'axios';

function DataInput() {
    const [date, setDate] = useState("")
    const [electricityUsage, setElectricityUsage] = useState("");
    const [waterUsage, setWaterUsage] = useState("");
    const [gasUsage, setGasUsage] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
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
    
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        
        if (!username) {
            setError("You must be logged in to submit data");
            return;
        }
        
        try {
            if (!date) {
                setError("Please select a date");
                return;
            }
            
            // Format the date to ensure it's in a consistent format (YYYY-MM-DD)
            const formattedDate = new Date(date).toISOString().split('T')[0];
            
            const usageData = {
                reqID: 2, // USER_USAGE_INFO
                waterUsage: parseFloat(waterUsage),
                electricityUsage: parseFloat(electricityUsage),
                gasUsage: parseFloat(gasUsage),
                username: username,
                date: formattedDate
            };
            
            console.log("Submitting data:", usageData);
            
            const response = await axios.post('http://localhost:8080/Backend/Backend', usageData);
            console.log("Response:", response);
            
            setMessage("Data submitted successfully! Your utility usage has been recorded.");
            
            // Clear the form
            setDate("");
            setElectricityUsage("");
            setWaterUsage("");
            setGasUsage("");
            
            // Add navigation suggestion after a brief delay
            setTimeout(() => {
                setMessage("Data submitted successfully! Your utility usage has been recorded. View your updated charts on the Dashboard.");
            }, 1500);
        } catch (err) {
            console.error("Error submitting data:", err);
            const axiosError = err as AxiosError;
            
            if (axiosError.response) {
                if (axiosError.response.status === 400) {
                    setError("Invalid data: Please ensure all fields have valid numeric values.");
                } else if (axiosError.response.status === 401) {
                    setError("Session expired: Please log in again to continue.");
                    setTimeout(() => navigate('/login'), 3000);
                } else if (axiosError.response.status === 500) {
                    setError("Server error: The system encountered an issue while saving your data. Please try again later.");
                } else {
                    setError(`Error submitting data: The server returned an error. Please try again later.`);
                }
            } else if (axiosError.request) {
                setError("Network error: Unable to connect to the server. Please check your internet connection and verify the backend server is running.");
            } else {
                setError("Error submitting data: An unexpected error occurred. Please try again later.");
            }
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
                
                {username && (
                    <div className="logged-in-user">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                        {username}
                    </div>
                )}
                
                <div>
                    <HomeButton/>
                    <SignOut/>
                </div>
            </header>
            
            <div className="header-welcome">
                <h1>Enter Utility Usage</h1>
                <p>Record your utility consumption to track your usage patterns and help reduce waste.</p>
            </div>
            
            <form onSubmit={submit} className='input'>
                <div className="input-section">
                    <div className="input-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                        </svg>
                        Usage Details
                    </div>
                    
                    <InputBox
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Select date"
                        required
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                            </svg>
                        }
                    />
                    
                    <InputBox
                        label="Electricity Usage"
                        type="number"
                        value={electricityUsage}
                        onChange={(e) => setElectricityUsage(e.target.value)}
                        placeholder="Enter kilowatt-hours (kWh)"
                        required
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                            </svg>
                        }
                    />
                    
                    <InputBox
                        label="Water Usage"
                        type="number"
                        value={waterUsage}
                        onChange={(e) => setWaterUsage(e.target.value)}
                        placeholder="Enter gallons"
                        required
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                                <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2zm-4.17-6c.37 0 .67.26.74.62.41 2.22 2.28 2.98 3.64 2.87.43-.02.79.32.79.75 0 .4-.32.73-.72.75-2.13.13-4.62-1.09-5.19-4.12-.08-.45.28-.87.74-.87z"/>
                            </svg>
                        }
                    />
                    
                    <InputBox
                        label="Gas Usage"
                        type="number"
                        value={gasUsage}
                        onChange={(e) => setGasUsage(e.target.value)}
                        placeholder="Enter cubic feet"
                        required
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#757575">
                                <path d="M4.5 2v2h-1V2h1m2 0v2h1V2h-1m3 0v2h-1V2h1m2 0v2h1V2h-1m3 0v2h-1V2h1m2 0v2h1V2h-1m-12 3v2h-2V5h2m1 0h2v2h-2V5m3 0h2v2h-2V5m3 0h2v2h-2V5m3 0h2v2h-2V5m-10 3v2h-2V8h2m1 0h2v2h-2V8m3 0h2v2h-2V8m3 0h2v2h-2V8m3 0h2v2h-2V8m-10 3v2h-2v-2h2m1 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m-10 3v2h-2v-2h2m1 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m-10 3v2h-2v-2h2m1 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m-10 3v2h-2v-2h2m1 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2m3 0h2v2h-2v-2z"/>
                            </svg>
                        }
                    />
                </div>
                
                {message && <div className="form-message success-message">{message}</div>}
                {error && <div className="form-message error-message">{error}</div>}
                
                <SubmitButton/>
            </form>
        </div>
      );
}

function SubmitButton() {
    return (
        <button type="submit" className='button'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Save Usage Data
        </button>
    );
}

function HomeButton() {
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

export default DataInput