import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/Home'
import SignUpPage from './pages/Signup'
import LoginPage from './pages/Login'
import DataInputPage from './pages/DataInput'
import Dashboard from './pages/Dashboard';
import ChallengesPage from './pages/ChallengesPage';
import CommunityPage from './pages/CommunityPage';
import NewsPage from './pages/NewsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/datainput' element={<DataInputPage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/challenges' element={<ChallengesPage/>}/>
        <Route path='/community' element={<CommunityPage/>}/>
        <Route path='/news' element={<NewsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;