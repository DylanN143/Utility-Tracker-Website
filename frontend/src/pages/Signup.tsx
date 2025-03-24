import React, { useState } from 'react';
import './Login-SignUp.css'
import '../components/Button.css'
import InputBox from '../components/InputBox';

function SignUp() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Username:", username);
      console.log("Password:", password);

      setEmail("");
      setUsername("");
      setPassword("");
    };

  return (
    <div>
        <header className='header'>
            <p>Sign up</p>
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

export default SignUp