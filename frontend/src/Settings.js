import React, { useState } from 'react';
import './styles/Settings.css';

const Settings = ({ isOpen, toggleSettings }) => {
  const [activeSection, setActiveSection] = useState('General');
  const [theme, setTheme] = useState('System');
  const [showCode, setShowCode] = useState(false);
  const [language, setLanguage] = useState('Auto-detect');

  // New state variables for other sections
  const [fontSize, setFontSize] = useState('Medium');
  const [voiceType, setVoiceType] = useState('Default');
  const [dataRetention, setDataRetention] = useState('30 days');
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [connectedApps, setConnectedApps] = useState([]);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'General':
        return (
          <>
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
          </>
        );
      case 'Personalization':
        return (
          <div className="setting-item">
            <span>Font Size</span>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        );
      case 'Speech':
        return (
          <div className="setting-item">
            <span>Voice Type</span>
            <select value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
              <option>Default</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        );
      case 'Data controls':
        return (
          <div className="setting-item">
            <span>Data Retention</span>
            <select value={dataRetention} onChange={(e) => setDataRetention(e.target.value)}>
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
            </select>
          </div>
        );
      case 'Builder profile':
        return (
          <div className="setting-item">
            <span>Profile Visibility</span>
            <select value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)}>
              <option>Public</option>
              <option>Private</option>
              <option>Friends Only</option>
            </select>
          </div>
        );
      case 'Connected apps':
        return (
          <div className="setting-item">
            <span>Connected Apps</span>
            <button onClick={() => setConnectedApps([...connectedApps, 'New App'])}>
              Add New App
            </button>
          </div>
        );
      case 'Security':
        return (
          <div className="setting-item">
            <span>Two-Factor Authentication</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={() => setTwoFactorAuth(!twoFactorAuth)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={toggleSettings}>×</button>
        </div>
        <div className="settings-content">
          <div className="settings-sidebar">
            {['General', 'Personalization', 'Speech', 'Data controls', 'Builder profile', 'Connected apps', 'Security'].map((section) => (
              <button
                key={section}
                className={`sidebar-button ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                <span className="icon">{getIconForSection(section)}</span> {section}
              </button>
            ))}
          </div>
          <div className="settings-main">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const getIconForSection = (section) => {
  const icons = {
    'General': '⚙️',
    'Personalization': '👤',
    'Speech': '🔊',
    'Data controls': '🔒',
    'Builder profile': '📄',
    'Connected apps': '🔗',
    'Security': '🛡️'
  };
  return icons[section] || '⚙️';
};

export default Settings;
