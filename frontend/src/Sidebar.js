import React from 'react';
import './styles/Sidebar.css';
import icon from './icons/left-sidebar.png';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Replace the button with an SVG icon using the img tag */}
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src={icon} alt="Menu Icon" className="menu-svg" />
      </div>
      {/* Sidebar content */}
      <div className="sidebar-content">
        <p>Welcome to the Sidebar!</p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
}

export default Sidebar;
