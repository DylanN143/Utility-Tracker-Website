import { useState, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios, { AxiosError } from 'axios';
// Import mock data for demo
import { mockUtilityData } from '../mockData/userData';

// Interface for data with date
interface DateData {
  date: string;
  value: number;
}

interface ElectricityChartProps {
  refreshKey?: number;
}

function ElectricityChart({ refreshKey = 0 }: ElectricityChartProps) {
  const [chartData, setChartData] = useState([
    { date: 'Loading', kWh: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [internalRefreshKey, setInternalRefreshKey] = useState(0); // Used for internal refresh

  // Combined refresh key including both internal and external refresh triggers
  const combinedRefreshKey = refreshKey + internalRefreshKey;

  const handleRefresh = () => {
    setLoading(true);
    setInternalRefreshKey(prevKey => prevKey + 1); // Increment to trigger useEffect
  };

  // Function to format chart data from mock data
  const formatMockData = () => {
    const formattedData = [];
    const today = new Date();

    // Create date mappings for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dateStr = `${day.getMonth() + 1}/${day.getDate()}`;

      formattedData.push({
        date: dateStr,
        kWh: mockUtilityData.electricity[6-i] // Index 0 is the oldest day (6 days ago)
      });
    }

    return formattedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = sessionStorage.getItem('username');
        if (!username) {
          setError('User not logged in');
          return;
        }

        const url = `http://localhost:8080/Backend/Backend?reqID=2&username=${username}`;
        const response = await axios.get(url);

        console.log('Backend response:', response.data);

        if (response.data.success === true) {
          // Parse the electricity data string into an array - or use directly if it's already an array
          let electricityData;
          try {
            // Try to parse if it's a string
            electricityData = JSON.parse(response.data.electricity);
            console.log('Parsed electricity data:', electricityData);
          } catch (e) {
            // If parsing fails, it might already be an array
            electricityData = response.data.electricity;
            console.log('Using electricity data directly:', electricityData);
          }

          // Format data for chart
          const formattedData = [];
          const today = new Date();

          // Map dates properly - the backend returns data for the past 7 days in reverse chronological order
          // Index 0 is today, 1 is yesterday, etc.
          const dateMappings = [];
          for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            const dateStr = `${day.getMonth() + 1}/${day.getDate()}`;
            dateMappings.push({
              date: dateStr,
              index: i  // Map to the corresponding index in the backend data
            });
          }

          // For non-empty values in the electricityData array, use actual values
          let hasData = false;

          for (let i = 0; i < dateMappings.length; i++) {
            const mapping = dateMappings[i];
            const dataIndex = mapping.index;

            // Check that we have a value for this date
            if (dataIndex >= 0 && dataIndex < electricityData.length && electricityData[dataIndex] >= 0) {
              formattedData.push({
                date: mapping.date,
                kWh: electricityData[dataIndex]
              });
              hasData = true;
            }
          }

          // If no data was found, show message
          if (!hasData) {
            setChartData([
              { date: 'No Data', kWh: 0 }
            ]);
          } else {
            // Sort by date (older to newer)
            formattedData.sort((a, b) => {
              const [monthA, dayA] = a.date.split('/').map(Number);
              const [monthB, dayB] = b.date.split('/').map(Number);

              // Create date objects for proper comparison
              const dateA = new Date(today.getFullYear(), monthA - 1, dayA);
              const dateB = new Date(today.getFullYear(), monthB - 1, dayB);

              return dateA.getTime() - dateB.getTime();
            });

            setChartData(formattedData);
          }
        } else {
          setError('No data available. Please add electricity usage data first.');
        }
      } catch (err) {
        console.error('Error fetching electricity data:', err);
        const axiosError = err as AxiosError;
        
        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            setError('Your session has expired. Please log in again.');
          } else if (axiosError.response.status === 404) {
            setError('No data found. Please add electricity usage data in the Data Entry page.');
          } else if (axiosError.response.status === 500) {
            setError('Server error while retrieving data. Please try again later.');
          } else {
            setError(`Error loading data. Please refresh or try again later.`);
          }
        } else if (axiosError.request) {
          setError('Network error: Unable to reach the server. Please check your internet connection.');
        } else {
          setError('Error loading electricity data. Please try refreshing the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [combinedRefreshKey]); // Include combinedRefreshKey to trigger refresh

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '10px', marginTop: '30px' }}>
      <div style={{ fontSize: '14px', marginBottom: '5px' }}>Loading electricity usage data...</div>
      <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid rgba(255,255,255,0.2)', borderRadius: '50%', borderTop: '3px solid #ffffff', animation: 'spin 1s linear infinite' }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>;
  }

  if (error) {
    // Even in error state, for demo mode we'll use mock data
    console.log('Showing mock data instead of error for demo mode');
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke='#ffffff'/>
          <XAxis 
            dataKey="date"
            tick={{ fill: '#ffffff' }}
            axisLine={{ stroke: '#ffffff' }}
            tickLine={{ stroke: '#ffffff' }}
          />
          <YAxis 
            tick={{ fill: '#ffffff' }}
            axisLine={{ stroke: '#ffffff' }}
            tickLine={{ stroke: '#ffffff' }}
          />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: 'black', borderColor: '#888' }}/>
          <Bar dataKey="kWh" fill="gold" activeBar={<Rectangle fill="gold" stroke="black" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ElectricityChart