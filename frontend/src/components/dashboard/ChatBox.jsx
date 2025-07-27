import { useState, useRef, useEffect } from 'react';


export default function ChatBox({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
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

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 p-4"> {/* Removed background classes */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            placeholder="Ask Jigsaw to generate code..."
            className="flex-1 bg-[#0a0a2a]/70 border border-[#3a3a5a] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              transition: 'height 0.2s ease-out'
            }}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-lg font-medium transition-colors mb-1"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}