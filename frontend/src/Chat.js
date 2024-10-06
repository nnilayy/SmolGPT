// src/Chat.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';
import submitIcon from './icons/submit-arrow.png';
import uploadIcon from './icons/upload.png';
import micIcon from './icons/microphone.png'; // Import the microphone icon
import aiIcon from './icons/ai-star.png';
import './styles/Chat.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isListening, setIsListening] = useState(false); // For speech recognition

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const recognitionRef = useRef(null); // For speech recognition

  const isSpeechRecognitionSupported =
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '20px';
      textarea.style.height = `${Math.min(textarea.scrollHeight-20, 100)}px`;
    }
  };

  // Speech Recognition Setup
  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput((prevInput) => `${prevInput} ${speechToText}`.trim());
      adjustTextareaHeight();
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access is denied. Please enable it in your browser settings.');
      } else if (event.error === 'no-speech') {
        alert('No speech was detected. Please try again.');
      } else {
        alert(`Speech recognition error: ${event.error}`);
      }
    };
  }, [isSpeechRecognitionSupported]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const handleFilesSelected = useCallback((selectedFiles) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      selectedFiles.forEach((newFile) => {
        if (
          !prevFiles.some((file) => file.name === newFile.name) &&
          updatedFiles.length < 10
        ) {
          updatedFiles.push(newFile);
        }
      });
      return updatedFiles.slice(0, 10);
    });
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const handleFileChange = (event) => {
    handleFilesSelected(Array.from(event.target.files));
  };

  useEffect(() => {
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFilesSelected(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDrag);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDrag);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleFilesSelected]);

  const handleSend = async () => {
    if (isWaitingForResponse) return; // Prevent sending if waiting for response
    if (input.trim() !== '' || files.length > 0) {
      setIsWaitingForResponse(true); // Set to true when starting to send
      try {
        // Upload files first
        let uploadedFiles = [];
        if (files.length > 0) {
          const uploadFormData = new FormData();
          files.forEach((file) => {
            uploadFormData.append('files', file); // Append files with the same key 'files'
          });

          const uploadResponse = await axios.post(
            'http://localhost:8080/upload',
            uploadFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          uploadedFiles = uploadResponse.data.filenames;
        }

        // Add user message to chat
        const userMessage = { sender: 'user', text: input, files: uploadedFiles };
        setMessages([...messages, userMessage]);
        setInput('');
        setFiles([]);
        if (textareaRef.current) {
          textareaRef.current.style.height = '20px';
        }

        // Send text and filenames to /chat endpoint
        const chatResponse = await axios.post('http://localhost:8080/chat', {
          message: input,
          files: uploadedFiles,
        });

        const aiMessageText = chatResponse.data.response;

        // Process markdown in AI response
        const htmlContent = marked.parse(aiMessageText);
        const cleanHTML = DOMPurify.sanitize(htmlContent);

        const aiMessage = { sender: 'ai', text: cleanHTML, isHTML: true };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage = {
          sender: 'ai',
          text: 'Sorry, there was an error processing your message.',
          isHTML: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsWaitingForResponse(false); // Set back to false after response or error
      }
    }
  };

  const handleKeyPress = (e) => {
    if (isWaitingForResponse) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {isDragging && (
        <div className="drag-overlay">
          <div>Drop your files here</div>
        </div>
      )}
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
                  {msg.files && msg.files.length > 0 && (
                    <div className="attached-files">
                      {msg.files.map((filename, fileIndex) => (
                        <div key={fileIndex} className="attached-file">
                          {filename}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="message-circle message-circle-user" />
              </>
            ) : (
              <>
                <div className="message-circle message-circle-ai">
                  <img src={aiIcon} alt="AI Icon" className="ai-icon" />
                </div>
                <div
                  className="message-content message-ai"
                  dangerouslySetInnerHTML={
                    msg.isHTML
                      ? { __html: msg.text }
                      : { __html: DOMPurify.sanitize(marked.parse(msg.text)) }
                  }
                />
                <div className="message-spacer" />
              </>
            )}
          </div>
        ))}
        {isWaitingForResponse && (
          <div className="message-row message-row-ai">
            <div className="message-circle message-circle-ai">
              <img src={aiIcon} alt="AI Icon" className="ai-icon" />
            </div>
            <div className="message-content message-ai">
              <em>AI is typing...</em>
            </div>
            <div className="message-spacer" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        {files.length > 0 && (
          <FileUploader
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            files={files}
          />
        )}
        <div className="input-row">
          <img
            src={uploadIcon}
            alt="Upload"
            onClick={() => fileInputRef.current.click()}
            className="upload-icon"
          />
          <textarea
            ref={textareaRef}
            placeholder="Message SmolGPT..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyPress}
            disabled={isWaitingForResponse}
          />
          {isSpeechRecognitionSupported && (
            <img
              src={micIcon}
              alt="Speak"
              onClick={handleMicClick}
              className={`mic-icon ${isListening ? 'active' : ''}`}
            />
          )}
          <img
            src={submitIcon}
            alt="Send"
            onClick={!isWaitingForResponse ? handleSend : null}
            className={`submit-icon ${isWaitingForResponse ? 'disabled' : ''}`}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
      </div>
    </div>
  );
}

export default Chat;
