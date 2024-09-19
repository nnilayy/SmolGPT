import React, { useState } from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import Footer from './Footer';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './styles/App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Chat />
      <Footer />
    </div>
  );
}

export default App;
