import { useState, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios, { AxiosError } from 'axios';

// Interface for data with date
interface DateData {
  date: string;
  value: number;
}

interface WaterChartProps {
  refreshKey?: number;
}

function WaterChart({ refreshKey = 0 }: WaterChartProps) {
  const [chartData, setChartData] = useState([
    { date: 'Loading', gallons: 0 },
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
          // Parse the water data string into an array - or use directly if it's already an array
          let waterData;
          try {
            // Try to parse if it's a string
            waterData = JSON.parse(response.data.water);
            console.log('Parsed water data:', waterData);
          } catch (e) {
            // If parsing fails, it might already be an array
            waterData = response.data.water;
            console.log('Using water data directly:', waterData);
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

          // For non-empty values in the waterData array, use actual values
          let hasData = false;

          for (let i = 0; i < dateMappings.length; i++) {
            const mapping = dateMappings[i];
            const dataIndex = mapping.index;

            // Check that we have a value for this date
            if (dataIndex >= 0 && dataIndex < waterData.length && waterData[dataIndex] >= 0) {
              formattedData.push({
                date: mapping.date,
                gallons: waterData[dataIndex]
              });
              hasData = true;
            }
          }

          // If no data was found, show message
          if (!hasData) {
            setChartData([
              { date: 'No Data', gallons: 0 }
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
          setError('No water usage data available. Please add data in the Data Entry page.');
        }
      } catch (err) {
        console.error('Error fetching water data:', err);
        const axiosError = err as AxiosError;
        
        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            setError('Your session has expired. Please log in again.');
          } else if (axiosError.response.status === 404) {
            setError('No data found. Please add gas usage data in the Data Entry page.');
          } else if (axiosError.response.status === 500) {
            setError('Server error while retrieving data. Please try again later.');
          } else {
            setError(`Error loading data. Please refresh or try again later.`);
          }
        } else if (axiosError.request) {
          setError('Network error: Unable to reach the server. Please check your internet connection.');
        } else {
          setError('Error loading gas data. Please try refreshing the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [combinedRefreshKey]); // Include combinedRefreshKey to trigger refresh

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '10px', marginTop: '30px' }}>
      <div style={{ fontSize: '14px', marginBottom: '5px' }}>Loading water usage data...</div>
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
    return <div className="data-error">{error}</div>;
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
          <Bar dataKey="gallons" fill="lightblue" activeBar={<Rectangle fill="lightblue" stroke="black" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WaterChart