import React from 'react';
import './styles/Navbar.css';
import icon from './icons/right-sidebar.png';
function Navbar({ toggleSidebar }) {
  return (
    <nav className="navbar">
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src={icon} alt="Menu Icon" className="menu-svg" />
      </div>
      <div className="navbar-brand">SmolGPT</div>
      <div className="navbar-profile">
        <div className="profile-photo"></div>
      </div>
    </nav>
  );
}

export default Navbar;
