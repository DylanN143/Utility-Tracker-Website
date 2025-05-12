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
    const [advice, setAdvice] = useState("");
    const [electricityAdvice, setElectricityAdvice] = useState("");
    const [waterAdvice, setWaterAdvice] = useState("");
    const [gasAdvice, setGasAdvice] = useState("");
    const navigate = useNavigate();

    // Get username from localStorage (set by AuthLayout)
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setElectricityAdvice("");
        setWaterAdvice("");
        setGasAdvice("");
        setAdvice("");
        
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

            if (parseFloat(electricityUsage) > 26.2 || parseFloat(waterUsage) > 201.6 || parseFloat(gasUsage) > 93.3)
            {
                setAdvice("Some of your utilities usage is higher than the average in your area, check out some tips to save below!");
            }
            else
            {
                setAdvice("Your utilities usage is lower than the average, check out some tips to save even more below!");
            }

            try {
                const getAdvice = {
                    reqID: 6, // GET_ADVICE
                    water: waterUsage,
                    electricity: electricityUsage,
                    gas: gasUsage
                };

                const response = await axios.get('http://localhost:8080/Backend/Backend', {params: getAdvice});
                console.log("Response:", response);

                if (response.data.success === true) {
                    try {
                        // Try to parse and set message
                        const waterAdvice = response.data.waterAdvice.title + ": " + response.data.waterAdvice.content;
                        console.log("Water advice: ", waterAdvice);
                        setWaterAdvice(waterAdvice);

                        const electricityAdvice = response.data.electricityAdvice.title + ": " + response.data.electricityAdvice.content;
                        console.log("Electricity advice: ", electricityAdvice);
                        setElectricityAdvice(electricityAdvice);

                        const gasAdvice = response.data.gasAdvice.title + ": " + response.data.gasAdvice.content;
                        console.log("Gas advice: ", gasAdvice);
                        setGasAdvice(gasAdvice);
                    } catch (e) {
                        // If parsing fails, output error
                        console.log('Advice retrieval failed:');
                    }
                }
            } catch (err) {
                console.error("Error retrieving advice:", err);
            }
            
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
        <div style={{ padding: '20px' }}>
            <div className="header-welcome" style={{
                textAlign: 'center',
                marginBottom: '30px',
                color: 'white'
            }}>
                <h1>Enter Utility Usage</h1>
                <p style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>Record your utility consumption to track your usage patterns and help reduce waste.</p>
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
                {advice && <div className='form-message advice-message'>{advice}</div>}
                {electricityAdvice && <div className='form-message advice-message'>{electricityAdvice}</div>}
                {waterAdvice && <div className='form-message advice-message'>{waterAdvice}</div>}
                {gasAdvice && <div className='form-message advice-message'>{gasAdvice}</div>}
                {error && <div className="form-message error-message">{error}</div>}
                
                <button type="submit" className='button'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Save Usage Data
                </button>
            </form>
        </div>
    );
}

export default DataInput