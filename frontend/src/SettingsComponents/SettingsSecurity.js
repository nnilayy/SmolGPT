// src/SettingsComponents/SettingsSecurity.js
import React from 'react';

const SettingsSecurity = ({ twoFactorAuth, setTwoFactorAuth }) => {
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
};

export default SettingsSecurity;
