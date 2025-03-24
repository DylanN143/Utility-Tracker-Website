import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import InputBox from '../components/InputBox';

function DataInput() {
    const [date, setDate] = useState("")
    const [electricityUsage, setElectricityUsage] = useState("");
    const [waterUsage, setWaterUsage] = useState("");
    const [gasUsage, setGasUsage] = useState("");
    
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Date:", date);
        console.log("Electricity Usage:", electricityUsage);
        console.log("Water Usage:", waterUsage);
        console.log("Gas Usage:", gasUsage);

        setDate("");
        setElectricityUsage("");
        setWaterUsage("");
        setGasUsage("");
    };

    return (
        <div>
            <header className='header'>
                <p>Utility Usage Data Input</p>
                <HomeButton/>
            </header>
            <form onSubmit={submit} className='input'>
                <InputBox
                label="Date "
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Enter date"
                required
                />
                <InputBox
                label="Electricity (kWh) "
                type="number"
                value={electricityUsage}
                onChange={(e) => setElectricityUsage(e.target.value)}
                placeholder="Enter electricity usage"
                required
                />
                <InputBox
                label="Water (gallons) "
                type="number"
                value={waterUsage}
                onChange={(e) => setWaterUsage(e.target.value)}
                placeholder="Enter water usage"
                required
                />
                <InputBox
                label="Gas (therms) "
                type="number"
                value={gasUsage}
                onChange={(e) => setGasUsage(e.target.value)}
                placeholder="Enter gas usage"
                required
                />
                
                <SubmitButton/>
            </form>
        </div>
      );
}

function SubmitButton() {
    return (
        <button type="submit" className='button'>Add</button>
    );
}

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button className='button' onClick={() => navigate('/home')}>Home</button>
  );
}

export default DataInput