import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { date: '4/10', cubicft: 25 },
    { date: '4/11', cubicft: 10 },
    { date: '4/12', cubicft: 17 },
    { date: '4/13', cubicft: 15 },
    { date: '4/14', cubicft: 19 },
    { date: '4/15', cubicft: 20.1 },
    { date: '4/16', cubicft: 21.2 },
];

function GasChart() {
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
        <Bar dataKey="cubicft" fill="lightgreen" activeBar={<Rectangle fill="lightgreen" stroke="black" />} />
    </BarChart>
    </ResponsiveContainer>
    );
}

export default GasChart