// src/SettingsComponents/SettingsDataControls.js
import React from 'react';

const SettingsDataControls = ({ dataRetention, setDataRetention }) => {
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
};

export default SettingsDataControls;
