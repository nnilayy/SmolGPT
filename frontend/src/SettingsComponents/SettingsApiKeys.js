// src/SettingsComponents/SettingsApiKeys.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SettingsApiKeys.css';
import CopyToClipboard from '../icons/copy-to-clipboard.png';
import EyeOpenIcon from '../icons/eye-open.png';
import EyeClosedIcon from '../icons/eye-close.png';

const SettingsApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    // Fetch API keys from the backend when the component mounts
    axios
      .get('http://localhost:8000/get_api_keys')
      .then((response) => {
        if (response.data && response.data.length > 0) {
          // Update the apiKeys state with the data from the backend
          setApiKeys(
            response.data.map((key, index) => ({
              name: key.name || `API Key ${index + 1}`,
              value: key.value || '',
              hidden: true,
            }))
          );
        } else {
          // Initialize with empty API keys if backend returns no data
          setApiKeys(
            Array.from({ length: 10 }, (_, index) => ({
              name: `API Key ${index + 1}`,
              value: '',
              hidden: true,
            }))
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching API keys:', error);
        // Initialize with empty API keys if there's an error
        setApiKeys(
          Array.from({ length: 10 }, (_, index) => ({
            name: `API Key ${index + 1}`,
            value: '',
            hidden: true,
          }))
        );
      });
  }, []);

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
      navigator.clipboard.writeText(value).catch((err) => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  const saveApiKeys = () => {
    // Send the API keys to the backend
    axios
      .post('http://localhost:8000/save_api_keys', apiKeys)
      .then((response) => {
        alert('API Keys saved on backend successfully.');
      })
      .catch((error) => {
        console.error('Error saving API keys:', error);
        alert('Error saving API Keys.');
      });
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
              src={key.hidden ? EyeClosedIcon : EyeOpenIcon}
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
      <button className="save-button" onClick={saveApiKeys}>
        Save
      </button>
    </div>
  );
};

export default SettingsApiKeys;
