import { useNavigate } from 'react-router-dom';
import './Home.css'
import '../components/Button.css'

function Home() {
  return (
    <div className="Home">
    <div className="buttons">
        <p className="get-started">Get Started</p>
        <SignUp/>
        <Login/>
    </div>
    <header className="Home-header">
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

export default Home;