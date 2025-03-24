import { useNavigate } from 'react-router-dom';
import './Home.css'
import '../components/Button.css'
import '../components/Header.css'

function Home() {
  return (
    <div>
    <div className="buttons">
        <p className="get-started">Get Started</p>
        <SignUp/>
        <Login/>
        <DataInput/>
    </div>
    <header className="header">
        <p>Welcome to "Name of Our Webiste"</p>
    </header>
    </div>
  );
}

function SignUp()
{
  const navigate = useNavigate();

  return (
    <button className="button" onClick={() => navigate('/signup')}>Sign Up</button>
  );
}

function Login() 
{
    const navigate = useNavigate();

    return (
      <button className="button" onClick={() => navigate('/login')}>Login</button>
    );
}

function DataInput() 
{
    const navigate = useNavigate();

    return (
      <button className="button" onClick={() => navigate('/datainput')}>Data Input</button>
    );
}

export default Home;