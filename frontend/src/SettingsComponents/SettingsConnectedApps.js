// src/SettingsComponents/SettingsConnectedApps.js
import React from 'react';

const SettingsConnectedApps = ({ connectedApps, setConnectedApps }) => {
  return (
    <div className="setting-item">
      <span>Connected Apps</span>
      <button
        onClick={() => {
          // Logic to add a new app
          const newAppName = prompt('Enter the name of the new app:');
          if (newAppName) {
            setConnectedApps([...connectedApps, newAppName]);
          }
        }}
      >
        Add New App
      </button>
      <ul>
        {connectedApps.map((app, index) => (
          <li key={index}>{app}</li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsConnectedApps;
