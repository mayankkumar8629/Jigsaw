import { useState, useRef, useEffect } from 'react';

export default function ChatBox({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form 
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a2a]/90 to-transparent backdrop-blur-sm"
    >
      <div className="flex max-w-3xl mx-auto gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Jigsaw to generate code..."
          className="flex-1 bg-[#0a0a2a]/70 border border-[#3a3a5a] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
}