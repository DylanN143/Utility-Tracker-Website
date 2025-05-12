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

interface GasChartProps {
  refreshKey?: number;
}

function GasChart({ refreshKey = 0 }: GasChartProps) {
  const [chartData, setChartData] = useState([
    { date: 'Loading', cubicft: 0 },
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
        cubicft: mockUtilityData.gas[6-i] // Index 0 is the oldest day (6 days ago)
      });
    }

    return formattedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate network delay for demo mode
        setLoading(true);

        // Check if we're in demo mode (no server connection)
        setTimeout(() => {
          try {
            // Use mock data
            console.log('Using mock gas data:', mockUtilityData.gas);
            const formattedData = formatMockData();
            setChartData(formattedData);
            setLoading(false);
          } catch (err) {
            console.error('Error processing mock gas data:', err);
            setError('Error loading demo data');
            setLoading(false);
          }
        }, 1000);

        /* Original server-based code (commented out for demo)
        const username = sessionStorage.getItem('username');
        if (!username) {
          setError('User not logged in');
          return;
        }

        const url = `http://localhost:8080/Backend/Backend?reqID=2&username=${username}`;
        const response = await axios.get(url);

        console.log('Backend response:', response.data);

        if (response.data.success === true) {
          // Parse the gas data string into an array - or use directly if it's already an array
          let gasData;
          try {
            // Try to parse if it's a string
            gasData = JSON.parse(response.data.gas);
            console.log('Parsed gas data:', gasData);
          } catch (e) {
            // If parsing fails, it might already be an array
            gasData = response.data.gas;
            console.log('Using gas data directly:', gasData);
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

          // For non-empty values in the gasData array, use actual values
          let hasData = false;

          for (let i = 0; i < dateMappings.length; i++) {
            const mapping = dateMappings[i];
            const dataIndex = mapping.index;

            // Check that we have a value for this date
            if (dataIndex >= 0 && dataIndex < gasData.length && gasData[dataIndex] >= 0) {
              formattedData.push({
                date: mapping.date,
                cubicft: gasData[dataIndex]
              });
              hasData = true;
            }
          }

          // If no data was found, show message
          if (!hasData) {
            setChartData([
              { date: 'No Data', cubicft: 0 }
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
          setError('No gas usage data available. Please add data in the Data Entry page.');
        }
        */
      } catch (err) {
        console.error('Error fetching gas data:', err);
        // In demo mode, we'll use mock data even if there's an error
        const formattedData = formatMockData();
        setChartData(formattedData);
        setLoading(false);
      }
    };

    fetchData();
  }, [combinedRefreshKey]); // Include combinedRefreshKey to trigger refresh

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '10px', marginTop: '30px' }}>
      <div style={{ fontSize: '14px', marginBottom: '5px' }}>Loading gas usage data...</div>
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
          <Bar dataKey="cubicft" fill="lightgreen" activeBar={<Rectangle fill="lightgreen" stroke="black" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GasChart