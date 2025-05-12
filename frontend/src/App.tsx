import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import SignUpPage from './pages/Signup';
import LoginPage from './pages/Login';
import DataInputPage from './pages/DataInput';
import Dashboard from './pages/Dashboard';
import ChallengesPage from './pages/ChallengesPage';
import CommunityPage from './pages/CommunityPage';
import NewsPage from './pages/NewsPage';
import AuthLayout from './components/AuthLayout';
import './components/AuthLayout.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<HomePage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>

        {/* Protected routes with navigation bar */}
        <Route path='/dashboard' element={
          <AuthLayout>
            <Dashboard/>
          </AuthLayout>
        }/>
        <Route path='/datainput' element={
          <AuthLayout>
            <DataInputPage/>
          </AuthLayout>
        }/>
        <Route path='/challenges' element={
          <AuthLayout>
            <ChallengesPage/>
          </AuthLayout>
        }/>
        <Route path='/community' element={
          <AuthLayout>
            <CommunityPage/>
          </AuthLayout>
        }/>
        <Route path='/news' element={
          <AuthLayout>
            <NewsPage/>
          </AuthLayout>
        }/>

        {/* Catch-all route */}
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;