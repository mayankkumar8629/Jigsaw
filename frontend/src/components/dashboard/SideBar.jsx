import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LogoutButton from '../ui/LogoutButton.jsx';
import { FiPlus } from 'react-icons/fi';



export default function Sidebar({ onNewChat }) {
      
  return (
    <div className="w-64 h-full bg-[#0a0a2a]/90 border-r border-[#3a3a5a] p-4 flex flex-col">
      {/* Top Section */}
      <div className="mb-6">
        {/* Jigsaw Logo - Matches Navbar exactly */}
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

        {/* New Chat Button with icon */}
        <button 
          className="
            flex items-center justify-center gap-2
            w-full bg-blue-600 hover:bg-blue-700 
            text-white py-1.5 px-4 rounded-lg 
            transition-colors text-sm
          "
          onClick={onNewChat}
        >
          <FiPlus size={16} />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">History</h2>
        <div className="space-y-1">
          {['Component Generator', 'Auth Flow', 'Dashboard Layout'].map((item, i) => (
            <Link
              key={i}
              to="#"
              className="block text-white hover:bg-[#3a3a5a]/50 px-3 py-2 rounded-md transition-colors text-sm"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Logout Section - Using your existing component */}
      <div className="mt-auto pt-4 border-t border-[#3a3a5a] relative z-10">
        <div className="px-2 relative z-10">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}