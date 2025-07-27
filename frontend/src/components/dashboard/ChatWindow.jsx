import React, { useEffect, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';

// const messages = [
//   {
//     sender: 'user',
//     text: 'Create a complete React component with Tailwind CSS that has a responsive navbar, dark mode toggle, and a hero section with animated gradients.'
//   },
//   {
//     sender: 'bot',
//     text: `Here's a complete implementation:

// \`\`\`jsx
// import { useState, useEffect } from 'react';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

// export default function AppHeader() {
//   const [darkMode, setDarkMode] = useState(() => 
//     localStorage.getItem('darkMode') === 'true'
//   );

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   return (
//     <div className="dark:bg-gray-900 transition-colors duration-300">
//       <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
//         <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//           Jigsaw
//         </div>
//         <div className="flex items-center space-x-8">
//           <button 
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
//           >
//             {darkMode ? (
//               <SunIcon className="h-6 w-6 text-yellow-300" />
//             ) : (
//               <MoonIcon className="h-6 w-6 text-gray-700" />
//             )}
//           </button>
//         </div>
//       </nav>

//       <div className="container mx-auto px-6 py-20">
//         <div className="max-w-3xl mx-auto text-center">
//           <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
//             Build Components Faster
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
//             Generate React components with AI and customize them in real-time
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// \`\`\`

// To use this:
// 1. Install \`@heroicons/react\`
// 2. Add dark mode class to your HTML tag
// 3. The navbar is fully responsive
// 4. Includes smooth transitions between modes`
//   },
//   {
//     sender: 'user',
//     text: `Now add a complex animated gradient background to the hero section that pulses slowly, and make sure it works with the dark mode toggle. Also include TypeScript types.`
//   },
//   {
//     sender: 'bot',
//     text: `Here's the enhanced version with TypeScript and animated gradients:

// \`\`\`tsx
// import { useState, useEffect, FC } from 'react';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

// interface AppHeaderProps {
//   initialDarkMode?: boolean;
// }

// const AppHeader: FC<AppHeaderProps> = ({ initialDarkMode = false }) => {
//   const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);
//   const [pulsePhase, setPulsePhase] = useState<number>(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setPulsePhase(prev => (prev + 0.005) % (2 * Math.PI));
//     }, 30);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', String(darkMode));
//   }, [darkMode]);

//   const gradientStyle = {
//     background: darkMode 
//       ? \`linear-gradient(\${pulsePhase}rad, #1e40af, #7c3aed, #4338ca)\`
//       : \`linear-gradient(\${pulsePhase}rad, #3b82f6, #8b5cf6, #6366f1)\`,
//     backgroundSize: '200% 200%',
//     animation: 'pulse 15s ease infinite'
//   };

//   return (
//     <div className="dark:bg-gray-900 transition-colors duration-300">
//       {/* Navbar same as before */}
      
//       <div 
//         className="container mx-auto px-6 py-32 rounded-3xl m-4"
//         style={gradientStyle}
//       >
//         <div className="max-w-3xl mx-auto text-center backdrop-blur-sm bg-white/10 dark:bg-black/10 p-8 rounded-3xl">
//           <h1 className="text-5xl font-bold mb-6 text-white">
//             Build Components Faster
//           </h1>
//           <p className="text-xl text-white/90 mb-10">
//             Generate React components with AI and customize them in real-time
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppHeader;
// \`\`\`

// Key additions:
// 1. TypeScript interface for props
// 2. Animated gradient using requestAnimationFrame
// 3. Dark mode compatible colors
// 4. Backdrop blur effect for readability
// 5. Proper typing for all hooks and components`
//   },
//   // More lengthy examples continue...
//   {
//     sender: 'user',
//     text: 'Show me how to implement a custom hook for drag-and-drop functionality that works with both mouse and touch events, has smooth animations, and supports dropping between multiple containers.'
//   },
//   {
//     sender: 'bot',
//     text: `Here's a comprehensive drag-and-drop hook implementation...` 
//     // [Actual lengthy implementation would go here]
//   }
// ];

export default function ChatWindow({ messages = [] }) { // Accept messages as prop
  const containerRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Add a visual feedback here
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

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
          {messages.length === 0 ? (
            // Show welcome message when no messages
            <div className="text-center text-gray-400 py-8">
              <p>Welcome to Jigsaw! Start by asking me to generate a component.</p>
            </div>
          ) : (
            // Render dynamic messages
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start pl-4'}`}
              >
                <div className={`relative group ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-xl max-w-[90%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
                    } whitespace-pre-wrap break-words`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    className={`absolute ${msg.sender === 'user' ? '-left-8' : '-right-8'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white`}
                    aria-label="Copy message"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}