import React, { useEffect, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';

export default function ChatWindow({ messages = [], isLoading = false }) {
  const containerRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        // TODO: Add visual feedback for successful copy
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-start pl-4">
      <div className="bg-gray-800 text-gray-200 rounded-xl rounded-tl-none px-4 py-3 max-w-[90%]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-400">Jigsaw is thinking...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto pl-12 pr-4 scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="flex flex-col justify-end min-h-full">
        <div className="space-y-4 mt-auto">
          {messages.length === 0 && !isLoading ? (
            // Show welcome message when no messages and not loading
            <div className="text-center text-gray-400 py-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Welcome to Jigsaw
                </h2>
              </div>
              <p>Start by asking me to generate a React component!</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Example: "Create a responsive navbar with dark mode toggle"</p>
              </div>
            </div>
          ) : (
            // Render messages
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start pl-4'}`}
              >
                <div className={`relative group ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} flex items-start`}>
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-xl max-w-[90%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : msg.isError
                        ? 'bg-red-800 text-red-200 rounded-tl-none'
                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
                    } whitespace-pre-wrap break-words`}
                  >
                    {msg.text}
                    
                    {/* Show code if present */}
                    {msg.code && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="text-xs text-gray-400 mb-2">Generated Code:</div>
                        <pre className="text-sm bg-gray-900 p-3 rounded overflow-x-auto">
                          <code>{msg.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(msg.code || msg.text)}
                    className={`absolute ${msg.sender === 'user' ? '-left-8' : '-right-8'} top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white`}
                    aria-label="Copy message"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && <LoadingIndicator />}
        </div>
      </div>
    </div>
  );
}