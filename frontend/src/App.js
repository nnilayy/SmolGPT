import React, { useState } from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Settings from './Settings';
import './styles/App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

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
      <Settings isOpen={isSettingsOpen} toggleSettings={toggleSettings} />
    </div>
  );
}

export default App;
