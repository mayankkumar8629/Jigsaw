import { useState, useRef, useEffect } from 'react';

export default function ChatBox({ onSendMessage, isLoading = false }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      resetTextareaHeight();
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '44px';
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    const maxHeight = 120;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  const handleKeyDown = (e) => {
  
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 p-4">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading} 
            placeholder={isLoading ? "Jigsaw is generating..." : "Ask Jigsaw to generate code..."}
            className={`flex-1 border border-[#3a3a5a] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all ${
              isLoading 
                ? 'bg-[#0a0a2a]/40 cursor-not-allowed text-gray-400' 
                : 'bg-[#0a0a2a]/70 hover:bg-[#0a0a2a]/80'
            }`}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              transition: 'height 0.2s ease-out'
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`h-12 px-6 rounded-lg font-medium transition-all mb-1 ${
              isLoading || !message.trim()
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}