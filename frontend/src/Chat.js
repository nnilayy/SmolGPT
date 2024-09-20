// src/Chat.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '0px';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  const handleSend = async () => {
    if (input.trim() !== '') {
      const userMessage = { sender: 'user', text: input };
      setMessages([...messages, userMessage]);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '25px';
      }

      try {
        // Send the user's message to the backend and get AI response
        const response = await axios.post('http://localhost:8000/chat', {
          message: input,
        });
        const aiMessage = { sender: 'ai', text: response.data.response };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage = {
          sender: 'ai',
          text: 'Sorry, there was an error processing your message.',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
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
