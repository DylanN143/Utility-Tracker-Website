import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { date: '4/10', kWh: 25 },
    { date: '4/11', kWh: 10 },
    { date: '4/12', kWh: 17 },
    { date: '4/13', kWh: 15 },
    { date: '4/14', kWh: 19 },
    { date: '4/15', kWh: 20.1 },
    { date: '4/16', kWh: 21.2 },
];

function ElectricityChart() {
  return (
    <ResponsiveContainer width="100%" height="85%">
    <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke='#ffffff'/>
        <XAxis dataKey="date"
                tick={{ fill: '#ffffff' }}
                axisLine={{ stroke: '#ffffff' }}
                tickLine={{ stroke: '#ffffff' }}
        />
        <YAxis tick={{ fill: '#ffffff' }}
                axisLine={{ stroke: '#ffffff' }}
                tickLine={{ stroke: '#ffffff' }}
        />
        <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: 'black', borderColor: '#888' }}/>
        <Bar dataKey="kWh" fill="gold" activeBar={<Rectangle fill="gold" stroke="black" />} />
    </BarChart>
    </ResponsiveContainer>
    );
}

export default ElectricityChart