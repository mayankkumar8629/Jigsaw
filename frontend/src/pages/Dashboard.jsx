import ChatBox from "../components/dashboard/ChatBox.jsx";
import Sidebar from "../components/dashboard/SideBar";
import Sandbox from "../components/dashboard/Sandbox.jsx";



import { useState } from 'react';


import { FiMenu, FiX, FiCode, FiEye } from 'react-icons/fi';


import ChatWindow from "../components/dashboard/ChatWindow.jsx";


export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = (message) => {
    console.log('Sending:', message);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0a0a2a] to-[#000000] relative text-white overflow-hidden">
      
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isSidebarOpen ? 'left-72' : 'left-4'
        }`}
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar} />
          <div className="w-64 h-full relative z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden">
          
          {/* ChatWindow (message view) */}
          <ChatWindow />

          {/* ChatBox (input) */}
          <div className="h-24 p-2 ">
            <ChatBox onSendMessage={handleSendMessage} />
          </div>
        </div>

        {/* Right Panel for Sandbox */}
        <div className="w-[35%] h-full p-2 pr-4">
          <div className="h-[80%] w-full">
            <Sandbox />
          </div>
        </div>
      </div>
    </div>
  );
}