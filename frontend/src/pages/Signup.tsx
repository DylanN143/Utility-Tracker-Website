import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import InputBox from '../components/InputBox';
import axios from 'axios'

function SignUp() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Email:", email);
      console.log("Username:", username);
      console.log("Password:", password);

      // REQUIRED
      const headers = {"Content-Type": "application/json"}

      try 
      {
        // Can also use the url: 
        // `http://localhost:8080/Backend/Backend?reqID=1&email=${email}&username=${username}&password=${password}`

        // use .get to get data from database
        const sendingInfo = await axios.post(
          `http://localhost:8080/Backend/Backend`, 
          {reqID: 1, email, username, password}, {headers: headers});

        console.log("Successful signup");
        setEmail("");
        setUsername("");
        setPassword("");
      }
      catch
      {
        console.log("Sign up error");
        setError("Something went wrong with the sign up!");

        // 3 seconds
        setTimeout(() => 
        {
          setError("");
        }, 3000) 
      }
    };

  return (
    <div className='header'>
        <header>
            <p>Sign up</p>
            <HomeButton/>
        </header>
        <form onSubmit={submit} className='input'>
            <InputBox
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            />
            <InputBox
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            />
            <InputBox
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter username"
            required
            />
            {error && <p style={{color: 'red'}}>{error}</p>}
            <SubmitButton/>
        </form>
    </div>
  );
}

function SubmitButton() {
    return (
        <button type="submit" className='button'>Sign Up</button>
    );
}

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button className='button' onClick={() => navigate('/home')}>Home</button>
  );
}

export default SignUp