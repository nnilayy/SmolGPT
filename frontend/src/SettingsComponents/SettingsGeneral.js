// src/SettingsComponents/SettingsGeneral.js
import React from 'react';

const SettingsGeneral = ({ theme, setTheme, showCode, setShowCode, language, setLanguage }) => {
  return (
    <>
      <div className="setting-item">
        <span>Theme</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="System">System</option>
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
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
};

export default SettingsGeneral;
