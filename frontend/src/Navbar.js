import React from 'react';
import './styles/Navbar.css';

function Navbar({ toggleSidebar }) {
  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={toggleSidebar}>Menu</button>
      <div className="navbar-brand">SmolGPT</div>
      <div className="navbar-profile">
        <div className="profile-photo"></div>
      </div>
    </nav>
  );
}

export default Navbar;
