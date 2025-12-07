import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import styles from './Chatbot.module.css';

const Chatbot = ({ videoId, transcription, videoTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: `Hi! I'm your AI learning assistant. I've analyzed the video "${videoTitle}". Ask me anything about the content!`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/videos/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoId,
          message: userMessage,
          transcription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add bot response
      setMessages(prev => [...prev, {
        type: 'bot',
        text: data.response,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          title="Chat with AI about this video"
        >
          <FaComments />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <FaRobot className={styles.robotIcon} />
              <div>
                <h3>AI Learning Assistant</h3>
                <p>Ask me about the video</p>
              </div>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                <div className={styles.messageAvatar}>
                  {msg.type === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className={styles.messageContent}>
                  <p>{msg.text}</p>
                  <span className={styles.messageTime}>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageAvatar}>
                  <FaRobot />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a question about the video..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className={styles.quickQuestions}>
              <p>Quick questions:</p>
              <button onClick={() => setInputMessage("What is the main topic?")}>
                What is the main topic?
              </button>
              <button onClick={() => setInputMessage("Summarize the key points")}>
                Summarize the key points
              </button>
              <button onClick={() => setInputMessage("Explain the most important concept")}>
                Explain the most important concept
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
