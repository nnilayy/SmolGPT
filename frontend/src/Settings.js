// src/Settings.js
import React, { useState } from 'react';
import './styles/Settings.css';

// Import your subsection components
import SettingsGeneral from './SettingsComponents/SettingsGeneral';
import SettingsPersonalization from './SettingsComponents/SettingsPersonalization';
import SettingsSpeech from './SettingsComponents/SettingsSpeech';
import SettingsDataControls from './SettingsComponents/SettingsDataControls';
import SettingsBuilderProfile from './SettingsComponents/SettingsBuilderProfile';
import SettingsConnectedApps from './SettingsComponents/SettingsConnectedApps';
import SettingsSecurity from './SettingsComponents/SettingsSecurity';

const Settings = ({ isOpen, toggleSettings, theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState('General');

  // Remove theme state from here
  // const [theme, setTheme] = useState('System');
  const [showCode, setShowCode] = useState(false);
  const [language, setLanguage] = useState('Auto-detect');

  // State variables for 'Personalization' section
  const [fontSize, setFontSize] = useState('Medium');

  // State variables for 'Speech' section
  const [voiceType, setVoiceType] = useState('Default');

  // State variables for 'Data controls' section
  const [dataRetention, setDataRetention] = useState('30 days');

  // State variables for 'Builder profile' section
  const [profileVisibility, setProfileVisibility] = useState('Public');

  // State variables for 'Connected apps' section
  const [connectedApps, setConnectedApps] = useState([]);

  // State variables for 'Security' section
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'General':
        return (
          <SettingsGeneral
            theme={theme}
            setTheme={setTheme}
            showCode={showCode}
            setShowCode={setShowCode}
            language={language}
            setLanguage={setLanguage}
          />
        );
      case 'Personalization':
        return (
          <SettingsPersonalization
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        );
      case 'Speech':
        return (
          <SettingsSpeech
            voiceType={voiceType}
            setVoiceType={setVoiceType}
          />
        );
      case 'Data controls':
        return (
          <SettingsDataControls
            dataRetention={dataRetention}
            setDataRetention={setDataRetention}
          />
        );
      case 'Builder profile':
        return (
          <SettingsBuilderProfile
            profileVisibility={profileVisibility}
            setProfileVisibility={setProfileVisibility}
          />
        );
      case 'Connected apps':
        return (
          <SettingsConnectedApps
            connectedApps={connectedApps}
            setConnectedApps={setConnectedApps}
          />
        );
      case 'Security':
        return (
          <SettingsSecurity
            twoFactorAuth={twoFactorAuth}
            setTwoFactorAuth={setTwoFactorAuth}
          />
        );
      default:
        return null;
    }
  };

  const getIconForSection = (section) => {
    const icons = {
      'General': '️',
      'Personalization': '',
      'Speech': '️',
      'Data controls': '',
      'Builder profile': '',
      'Connected apps': '',
      'Security': '',
    };
    return icons[section] || '';
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
            {[
              'General',
              'Personalization',
              'Speech',
              'Data controls',
              'Builder profile',
              'Connected apps',
              'Security',
            ].map((section) => (
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

export default Settings;
