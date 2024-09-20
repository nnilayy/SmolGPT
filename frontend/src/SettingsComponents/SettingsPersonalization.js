// src/SettingsComponents/SettingsPersonalization.js
import React from 'react';

const SettingsPersonalization = ({ fontSize, setFontSize }) => {
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
};

export default SettingsPersonalization;
