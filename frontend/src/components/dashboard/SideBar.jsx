import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LogoutButton from '../ui/LogoutButton.jsx';

import { 
  FiPlus, 
  FiClock, 
  FiMessageSquare 
} from 'react-icons/fi';


export default function Sidebar({ 
  onNewChat, 
  userSessions = [], 
  currentSessionId, 
  onSessionSelect, 
  loadingSessions = false,
  loadingSession = false 
}) {

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Truncate title if too long
  const truncateTitle = (title, maxLength = 25) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-64 h-full bg-[#0a0a2a]/90 border-r border-[#3a3a5a] p-4 flex flex-col">
      {/* Top Section */}
      <div className="mb-6">
        {/* Jigsaw Logo */}
        <Link
          to="/"
          className="
            text-3xl
            font-extrabold 
            bg-gradient-to-r 
            from-blue-400 
            via-purple-500 
            to-blue-600 
            bg-clip-text 
            text-transparent
            tracking-tighter
            drop-shadow-lg
            block mb-4
            hover:scale-105
            transition-transform
            duration-300
          "
        >
          Jigsaw
        </Link>

        {/* New Chat Button */}
        <button
          className="
            flex items-center justify-center gap-2
            w-full bg-blue-600 hover:bg-blue-700 
            text-white py-1.5 px-4 rounded-lg 
            transition-colors text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          onClick={onNewChat}
          disabled={loadingSession}
        >
          <FiPlus size={16} />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-gray-400 uppercase text-xs font-semibold mb-3 flex items-center gap-2">
          <FiClock size={12} />
          History
          {loadingSessions && (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </h2>

        <div className="space-y-1">
          {loadingSessions ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700/50 h-12 rounded-md mb-2"></div>
                </div>
              ))}
            </>
          ) : userSessions.length === 0 ? (
            // Empty state
            <div className="text-center py-8 text-gray-500">
              <FiMessageSquare size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">No chat history yet</p>
              <p className="text-xs mt-1">Start a new conversation!</p>
            </div>
          ) : (
            // Session list
            userSessions.map((session) => (
              <button
                key={session._id}
                onClick={() => onSessionSelect(session._id)}
                disabled={loadingSession}
                className={`
                  block w-full text-left px-3 py-2.5 rounded-md 
                  transition-colors text-sm group relative
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    currentSessionId === session._id
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-200'
                      : 'text-white hover:bg-[#3a3a5a]/50 border border-transparent'
                  }
                `}
              >
                {/* Loading indicator for active loading session */}
                {loadingSession && currentSessionId === session._id && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Session title */}
                <div className="font-medium mb-1 pr-6">
                  {truncateTitle(session.title)}
                </div>

                {/* Session date */}
                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                  {formatDate(session.createdAt)}
                </div>

                {/* Active indicator */}
                {currentSessionId === session._id && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r"></div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Logout Section */}
      <div className="mt-auto pt-4 border-t border-[#3a3a5a] relative z-10">
        <div className="px-2 relative z-10">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}