import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home'
import SignUpPage from './pages/Signup'
import LoginPage from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;