// src/SettingsComponents/SettingsBuilderProfile.js
import React from 'react';

const SettingsBuilderProfile = ({ profileVisibility, setProfileVisibility }) => {
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
};

export default SettingsBuilderProfile;
