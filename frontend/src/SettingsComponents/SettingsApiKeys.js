// src/SettingsComponents/SettingsApiKeys.js
import React, { useState } from 'react';
import '../styles/SettingsApiKeys.css';
import CopyToClipboard from '../icons/copy-to-clipboard.png';
import EyeOpenIcon from '../icons/eye-open.png';
import EyeClosedIcon from '../icons/eye-close.png';

const SettingsApiKeys = () => {
  // Initialize state for 10 API keys
  const [apiKeys, setApiKeys] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      name: `API Key ${index + 1}`,
      value: '',
      hidden: true,
    }))
  );

  const handleValueChange = (index, newValue) => {
    setApiKeys((prevKeys) =>
      prevKeys.map((key, idx) =>
        idx === index ? { ...key, value: newValue } : key
      )
    );
  };

  const toggleVisibility = (index) => {
    setApiKeys((prevKeys) =>
      prevKeys.map((key, idx) =>
        idx === index ? { ...key, hidden: !key.hidden } : key
      )
    );
  };

  const copyToClipboard = (value) => {
    if (value) {
      navigator.clipboard.writeText(value).then(
        () => {
          // Successfully copied to clipboard
        },
        (err) => {
          console.error('Could not copy text: ', err);
        }
      );
    }
  };

  return (
    <div className="api-keys-container">
      {apiKeys.map((key, index) => (
        <div className="api-key-item" key={index}>
          <label className="api-key-name">{key.name}</label>
          <div className="api-key-input-container">
            <input
              type={key.hidden ? 'password' : 'text'}
              value={key.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              className="api-key-input"
            />
            <img
              src={key.hidden ? EyeClosedIcon: EyeOpenIcon}
              alt={key.hidden ? 'Show API Key' : 'Hide API Key'}
              className="icon-button visibility-icon"
              onClick={() => toggleVisibility(index)}
            />
            <img
              src={CopyToClipboard}
              alt="Copy API Key"
              className="icon-button copy-icon"
              onClick={() => copyToClipboard(key.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsApiKeys;
