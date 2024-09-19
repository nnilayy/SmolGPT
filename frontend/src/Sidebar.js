import React from 'react';
import './styles/Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>Close</button>
      {/* Add sidebar content here */}
      <div className="sidebar-content">
        <p>Welcome to the Sidebar!</p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
}

export default Sidebar;
