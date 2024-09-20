import React, { useState } from 'react';
import './styles/Settings.css';

const Settings = ({ isOpen, toggleSettings }) => {
  const [theme, setTheme] = useState('System');
  const [showCode, setShowCode] = useState(false);
  const [language, setLanguage] = useState('Auto-detect');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={toggleSettings}>×</button>
        </div>
        <div className="settings-content">
          <div className="settings-sidebar">
            <button className="sidebar-button active">
              <span className="icon">⚙️</span> General
            </button>
            <button className="sidebar-button">
              <span className="icon">👤</span> Personalization
            </button>
            <button className="sidebar-button">
              <span className="icon">🔊</span> Speech
            </button>
            <button className="sidebar-button">
              <span className="icon">🔒</span> Data controls
            </button>
            <button className="sidebar-button">
              <span className="icon">📄</span> Builder profile
            </button>
            <button className="sidebar-button">
              <span className="icon">🔗</span> Connected apps
            </button>
            <button className="sidebar-button">
              <span className="icon">🛡️</span> Security
            </button>
          </div>
          <div className="settings-main">
            <div className="setting-item">
              <span>Theme</span>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="setting-item">
              <span>Always show code when using data analyst</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showCode}
                  onChange={() => setShowCode(!showCode)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item">
              <span>Language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option>Auto-detect</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="setting-item">
              <span>Archived chats</span>
              <button className="manage-button">Manage</button>
            </div>
            <div className="setting-item">
              <span>Archive all chats</span>
              <button className="archive-button">Archive all</button>
            </div>
            <div className="setting-item">
              <span>Delete all chats</span>
              <button className="delete-button">Delete all</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
