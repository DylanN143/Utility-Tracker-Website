import { useNavigate } from 'react-router-dom';
import './Home.css'
import '../components/Button.css'
import '../components/Header.css'

function Home() {
  return (
    <div className="header">
      <header>
        <div className="header-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"/>
          </svg>
          <p>EcoTrack</p>
        </div>
      </header>
      
      <div className="header-welcome">
        <h1>Monitor Your Utilities</h1>
        <p>
          Track your household utility usage, reduce waste, save money, 
          and help the environment with our easy-to-use utility tracking system.
        </p>
      </div>
      
      <div className="buttons-container">
        <SignUp/>
        <Login/>
        <DataInput/>
      </div>
      
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3m2 7.5c0 1.38-1.12 2.5-2.5 2.5S9 11.88 9 10.5 10.12 8 11.5 8s2.5 1.12 2.5 2.5z"/>
            </svg>
          </div>
          <h3>Track Usage</h3>
          <p>Monitor your water, electricity, and gas consumption in one place.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              <circle cx="12" cy="12" r="2"/>
              <path d="M19 3l-7 7"/>
              <path d="M21 1l-2 2-2-2"/>
            </svg>
          </div>
          <h3>Set Goals</h3>
          <p>Set monthly consumption targets and track your progress.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          </div>
          <h3>Save Money</h3>
          <p>Get insights on how to reduce your utility bills.</p>
        </div>
      </div>
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();

  return (
    <button className="homeButton" onClick={() => navigate('/signup')}>
      Get Started
    </button>
  );
}

function Login() {
    const navigate = useNavigate();

    return (
      <button className="button-outlined" onClick={() => navigate('/login')}>
        Login
      </button>
    );
}

function DataInput() {
    const navigate = useNavigate();

    return (
      <button className="button-outlined" onClick={() => navigate('/datainput')}>
        Enter Data
      </button>
    );
}

export default Home;