// src/components/NewDropdown.js

import React, { useState, useRef, useEffect } from 'react';
import '../styles/NewDropdown.css';

const NewDropdown = ({
  options,
  selectedOption,
  setSelectedOption,
  placeholder,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div
      className={`new-dropdown ${isDisabled ? 'disabled' : ''}`}
      ref={dropdownRef}
    >
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOption ? (
          <div className="dropdown-selected">
            {selectedOption.logo && (
              <img
                src={selectedOption.logo}
                alt=""
                className="dropdown-logo"
              />
            )}
            <span className="dropdown-label">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="dropdown-placeholder">{placeholder}</span>
        )}
        <span
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        ></span>
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map((option) => (
            <div
              key={option.value}
              className="dropdown-item"
              onClick={() => handleOptionClick(option)}
            >
              <div className="option-with-logo">
                {option.logo && (
                  <img
                    src={option.logo}
                    alt=""
                    className="option-logo"
                  />
                )}
                <span className="option-label">{option.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewDropdown;
