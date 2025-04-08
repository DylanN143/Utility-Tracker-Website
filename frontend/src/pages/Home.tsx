import { useNavigate } from 'react-router-dom';
import './Home.css'
import '../components/Button.css'
import '../components/Header.css'

function Home() {
  return (
    <div className="header">
      <header>
          <p>Welcome to "Name of Our Website"</p>
      </header>
      <div className="buttons">
        <p className="get-started">Get Started</p>
        <SignUp/>
        <Login/>
        <DataInput/>
      </div>
    </div>
  );
}

function SignUp()
{
  const navigate = useNavigate();

  return (
    <button className="homeButton" onClick={() => navigate('/signup')}>Sign Up</button>
  );
}

function Login() 
{
    const navigate = useNavigate();

    return (
      <button className="homeButton" onClick={() => navigate('/login')}>Login</button>
    );
}

function DataInput() 
{
    const navigate = useNavigate();

    return (
      <button className="homeButton" onClick={() => navigate('/datainput')}>Data Input</button>
    );
}

export default Home;