// src/SettingsComponents/SettingsModels.js

import '../styles/SettingsModels.css'; // Create this CSS file for styling
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Select, { components } from 'react-select';
import NewDropdown from './NewDropDown';

import modelOpenAI from '../icons/model-openai.png';
import modelAnthropic from '../icons/model-anthropic.png';
import modelGroq from '../icons/model-groq.png';
import modelGemini from '../icons/model-gemini.png';
import modelCohere from '../icons/model-cohere.png';
import modelOllama from '../icons/model-ollama.png';
import modelMistral from '../icons/model-mistral.png';
import modelHuggingface from '../icons/model-mistral.png';



const SettingsModels = () => {
  const companyData = {
      "OpenAI": {
          "ModelClass": "ChatOpenAI",
          "ModelLogo": modelOpenAI,
          "AvailableModels": [
            'gpt-4o',
            'gpt-4o-2024-08-06',
            'gpt-4o-2024-05-13',
            'chatgpt-4o-latest',
            'gpt-4o-mini',
            'gpt-4o-mini-2024-07-18',
            'gpt-4o-realtime-preview',
            'gpt-4o-realtime-preview-2024-10-01',
            'o1-preview',
            'o1-preview-2024-09-12',
            'o1-mini',
            'o1-mini-2024-09-12',
            'gpt-4-turbo',
            'gpt-4-turbo-2024-04-09',
            'gpt-4-turbo-preview',
            'gpt-4-0125-preview',
            'gpt-4-1106-preview',
            'gpt-4',
            'gpt-4-0613',
            'gpt-3.5-turbo',
            'gpt-3.5-turbo-0125',
            'gpt-3.5-turbo-1106',
        ]
    },

    "Google-Gemini": {
          "ModelClass": "ChatGoogleGenerativeAI",
          "ModelLogo": modelGemini,
          "AvailableModels": [
            'gemini-1.0-pro',
            'gemini-1.0-pro-latest',
            'gemini-1.0-pro-001',
            'gemini-1.5-pro',
            'gemini-1.5-pro-latest',
            'gemini-1.5-pro-001',
            'gemini-1.5-pro-002',
            'gemini-1.5-pro-exp-0827',
            'gemini-1.5-flash-8b',
            'gemini-1.5-flash-8b-latest',
            'gemini-1.5-flash-8b-001',
            'gemini-1.5-flash-8b-exp-0924',
            'gemini-1.5-flash-8b-exp-0827',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-001',
            'gemini-1.5-flash-002',
            'gemini-1.5-flash-exp-0827',
        ]
    },

    "Anthropic": {
    "ModelClass": "ChatAnthropic",
    "ModelLogo": modelAnthropic,
    "AvailableModels": [
        'claude-3-5-sonnet-20240620',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-2.1',
        'claude-2.0',
        'claude-instant-1.2',
    ]
    },

    "Cohere": {
        "ModelClass": "ChatCohere",
        "ModelLogo": modelCohere,
      "AvailableModels": [
          'command-r-plus-08-2024',
          'command-r-plus',
          'command-r-08-2024',
          'command-r',
        'command',
        'command-nightly',
        'command-light',
        'command-light-nightly',
        'c4ai-aya-23-35b',
        'c4ai-aya-23-8b',
      ]
    },

    "MistralAI": {
        "ModelClass": "ChatMistralAI",
        "ModelLogo": modelMistral,
        "AvailableModels": [
        'mistral-large-latest',
        'mistral-small-latest',
        'codestral-latest',
        'pixtral-12b-2409',
        'open-mistral-nemo',
        'open-codestral-mamba',
        'open-mistral-7b',
        'open-mixtral-8x7b',
        'open-mixtral-8x22b',
    ]
},

    "Groq": {
      "ModelClass": "ChatGroq",
      "ModelLogo": modelGroq,
      "AvailableModels": [
        'gemma2-9b-it',
        'gemma-7b-it',
        'llama3-groq-70b-8192-tool-use-preview',
        'llama3-groq-8b-8192-tool-use-preview',
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
        'llama-3.2-1b-preview',
        'llama-3.2-3b-preview',
        'llama-3.2-11b-vision-preview',
        'llama-guard-3-8b',
        'llava-v1.5-7b-4096-preview',
        'llama3-70b-8192',
        'llama3-8b-8192',
        'mixtral-8x7b-32768',
    ]
},
  };

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // Added state variables for save status message
  const [saveStatusMessage, setSaveStatusMessage] = useState('');
  const [saveStatusType, setSaveStatusType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    // Fetch current model settings from backend
    axios
      .get('http://localhost:8080/get_model_settings')
      .then((response) => {
        if (response.data) {
          const { ChatClass, model_api_name } = response.data;
          // Find the company that has the ChatClass
          const companyKey = Object.keys(companyData).find(
            (company) => companyData[company].ModelClass === ChatClass
          );
          if (companyKey) {
            const company = companyData[companyKey];
            setSelectedCompany({
              value: companyKey,
              label: companyKey,
              logo: company.ModelLogo,
            });
            setSelectedModel({
              value: model_api_name,
              label: model_api_name,
              logo: company.ModelLogo,
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching current model settings:', error);
      });
  }, []);

  // Prepare company options
  const companyOptions = Object.keys(companyData).map((companyKey) => {
    const company = companyData[companyKey];
    return {
      value: companyKey,
      label: companyKey,
      logo: company.ModelLogo,
    };
  });

  // Prepare model options
  let modelOptions = [];
  if (selectedCompany && companyData[selectedCompany.value]) {
    modelOptions = companyData[selectedCompany.value].AvailableModels.map(
      (model) => ({
        value: model,
        label: model,
        logo: companyData[selectedCompany.value].ModelLogo,
      })
    );
  }

  const saveModelSettings = () => {
    if (selectedCompany && selectedModel) {
      const ChatClass = companyData[selectedCompany.value]['ModelClass'];
      const model_api_name = selectedModel.value;

      // Send data to backend
      axios
        .post('http://localhost:8080/save_model_settings', {
          ChatClass: ChatClass,
          model_api_name: model_api_name,
        })
        .then((response) => {
          // Replace alert with on-screen success message
          setSaveStatusMessage(
            `Model has been switched to ${selectedModel.label}`
          );
          setSaveStatusType('success');

          // Clear the message after some time (optional)
          setTimeout(() => {
            setSaveStatusMessage('');
            setSaveStatusType('');
          }, 5000); // Clear after 5 seconds
        })
        .catch((error) => {
          console.error('Error saving model settings:', error);
          // Replace alert with on-screen error message
          setSaveStatusMessage('Error switching models.');
          setSaveStatusType('error');

          // Clear the message after some time (optional)
          setTimeout(() => {
            setSaveStatusMessage('');
            setSaveStatusType('');
          }, 5000); // Clear after 5 seconds
        });
    } else {
      // Show an error message if inputs are missing
      setSaveStatusMessage('Please select a model provider and a model name.');
      setSaveStatusType('error');

      // Clear the message after some time (optional)
      setTimeout(() => {
        setSaveStatusMessage('');
        setSaveStatusType('');
      }, 5000); // Clear after 5 seconds
    }
  };

  return (
    <div className="settings-models-container">
      <div className="setting-item">
        <h3 className="setting-title">Select Model Provider</h3>
        <NewDropdown
          options={companyOptions}
          selectedOption={selectedCompany}
          setSelectedOption={(option) => {
            setSelectedCompany(option);
            setSelectedModel(null); // Reset model selection when company changes
          }}
          placeholder="-- Select Model Provider --"
          isDisabled={false}
        />
      </div>
      <div className="setting-item">
        <h3 className="setting-title">Select Model Name</h3>
        <NewDropdown
          options={modelOptions}
          selectedOption={selectedModel}
          setSelectedOption={setSelectedModel}
          placeholder="-- Select Model Name --"
          isDisabled={!selectedCompany}
        />
      </div>

      {/* Display the save status message */}
      {saveStatusMessage && (
        <div
          className={`save-status-message ${
            saveStatusType === 'success' ? 'success' : 'error'
          }`}
        >
          {saveStatusMessage}
        </div>
      )}

      {/* Wrap the button in a container for positioning */}
      <div className="save-button-container">
        <button className="save-button" onClick={saveModelSettings}>
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsModels;