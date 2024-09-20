import React from 'react';
import './styles/Sidebar.css';
import icon from './icons/left-sidebar.png';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="menu-icon" onClick={toggleSidebar}>
        <img src={icon} alt="Menu Icon" className="menu-svg" />
      </div>
      <div className="sidebar-content">
        <p>Welcome to the Sidebar!</p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
}

export default Sidebar;
