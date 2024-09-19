// src/Chat.js
import React, { useState, useRef, useEffect } from 'react';
import './styles/Chat.css';

function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Adjust messages container height when component mounts
    const messagesContainer = document.querySelector('.messages-container');
    const inputContainer = document.querySelector('.input-container');
    if (messagesContainer && inputContainer) {
      messagesContainer.style.height = `calc(100% - ${inputContainer.offsetHeight}px)`;
    }
  }, []);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '0px';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '25px';
      }

      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'ai',
            text: 'Thank you for your message! Here is a detailed response that might take up more space.',
          },
        ]);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${
              msg.sender === 'user' ? 'message-row-user' : 'message-row-ai'
            }`}
          >
            {msg.sender === 'user' ? (
              <>
                <div className="message-spacer" />
                <div className="message-content message-user">
                  {msg.text}
                </div>
                <div className="message-circle message-circle-user" />
              </>
            ) : (
              <>
                <div className="message-circle message-circle-ai" />
                <div className="message-content message-ai">
                  {msg.text}
                </div>
                <div className="message-spacer" />
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          ref={textareaRef}
          placeholder="Message SmolGPT..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      
    </div>
  );
}

export default Chat;
