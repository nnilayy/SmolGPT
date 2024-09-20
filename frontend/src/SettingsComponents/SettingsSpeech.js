// src/SettingsComponents/SettingsSpeech.js
import React from 'react';

const SettingsSpeech = ({ voiceType, setVoiceType }) => {
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
};

export default SettingsSpeech;
