import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import Notifications from './Notifications';

interface NavBarProps {
  username: string;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ username, onLogout }) => {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
          <path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"/>
        </svg>
        <span>EcoTrack</span>
      </div>

      <div className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/datainput"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Data Entry
        </NavLink>

        <NavLink
          to="/challenges"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Challenges
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Community
        </NavLink>

        <NavLink
          to="/news"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          News
        </NavLink>
      </div>

      <div className="nav-user">
        <Notifications username={username} />
        <span className="username">Hi, {username}</span>
        <button className="logout-button" onClick={onLogout}>Sign Out</button>
      </div>
    </nav>
  );
};

export default NavBar;