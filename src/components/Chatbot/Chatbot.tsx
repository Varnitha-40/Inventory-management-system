import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you with inventory management today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Bot responses based on keywords
  const getBotResponse = (message: string) => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('predict') || lowerCaseMessage.includes('forecast')) {
      return 'You can use our AI Prediction tool to forecast future product demand. Go to the "Predict Demand" page to get started!';
    } else if (lowerCaseMessage.includes('add') || lowerCaseMessage.includes('new product')) {
      return 'To add a new product, navigate to the "Add Product" page and fill out the form with your product details.';
    } else if (lowerCaseMessage.includes('inventory') || lowerCaseMessage.includes('stock')) {
      return 'You can view your current inventory on the "View Inventory" page. You can search, filter, and manage all your products there.';
    } else if (lowerCaseMessage.includes('dashboard')) {
      return 'The Dashboard provides an overview of your inventory metrics, including total products, low stock items, and inventory value.';
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return 'Hello! How can I assist you with your inventory management today?';
    } else if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! If you have any other questions, feel free to ask.";
    } else {
      return "I'm not sure I understand. Could you please rephrase your question? You can ask about inventory management, adding products, or demand prediction.";
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent-dark text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-40 w-80 sm:w-96 bg-primary-dark rounded-lg shadow-xl overflow-hidden flex flex-col"
            style={{ height: '400px' }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="bg-secondary p-4 flex items-center justify-between">
              <h3 className="text-white font-medium">Inventory Assistant</h3>
              <button 
                onClick={toggleChatbot}
                className="text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-accent text-white rounded-tr-none'
                        : 'bg-primary-light text-white rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-primary-light text-white p-3 rounded-lg rounded-tl-none">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 p-2 rounded-l-lg bg-primary border border-gray-700 focus:outline-none focus:ring-1 focus:ring-accent text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={input.trim() === ''}
                  className={`p-2 rounded-r-lg bg-accent text-white ${
                    input.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-dark'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;