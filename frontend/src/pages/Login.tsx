import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Header.css'
import '../components/InputContainer.css'
import '../components/Button.css'
import InputBox from '../components/InputBox';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);

    setUsername("");
    setPassword("");
  };

  return (
    <div className='header'>
        <header>
            <p>Login</p>
            <HomeButton/>
        </header>
        <form onSubmit={submit} className='input'>
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
            
            <LoginButton/>
        </form>
    </div>
  );
}

function LoginButton() {
  return (
      <button type="submit" className='button'>Login</button>
  );
}

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button className='button' onClick={() => navigate('/home')}>Home</button>
  );
}

export default Login