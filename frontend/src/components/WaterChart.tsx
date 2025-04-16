import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { date: '4/10', gallons: 25 },
    { date: '4/11', gallons: 10 },
    { date: '4/12', gallons: 17 },
    { date: '4/13', gallons: 15 },
    { date: '4/14', gallons: 19 },
    { date: '4/15', gallons: 20.1 },
    { date: '4/16', gallons: 21.2 },
];

function WaterChart() {
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
        <Bar dataKey="gallons" fill="lightblue" activeBar={<Rectangle fill="lightblue" stroke="black" />} />
    </BarChart>
    </ResponsiveContainer>
    );
}

export default WaterChart