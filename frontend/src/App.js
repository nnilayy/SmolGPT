// src/App.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Settings from './Settings';
import './styles/App.css';
import './styles/colors.css'; // Import colors.css

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState('System');

  // Function to detect system theme
  const getSystemTheme = () => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'Dark' : 'Light';
  };

  // Apply theme class to body
  useEffect(() => {
    let appliedTheme = theme;
    if (theme === 'System') {
      appliedTheme = getSystemTheme();
    }
    document.body.classList.remove('light-theme', 'dark-theme');
    if (appliedTheme === 'Light') {
      document.body.classList.add('light-theme');
    } else if (appliedTheme === 'Dark') {
      document.body.classList.add('dark-theme');
    }
  }, [theme]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSettings = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} toggleSettings={toggleSettings} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Chat />
      <Footer />
      <Settings
        isOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}

export default App;
