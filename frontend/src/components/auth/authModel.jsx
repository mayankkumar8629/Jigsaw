import { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';

export default function AuthModal({ 
  mode = 'login', // Default to login view
  onClose 
}) {
  const [currentMode, setCurrentMode] = useState(mode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Login/Signup toggle */}
        {currentMode === 'login' ? (
          <LoginForm 
            onClose={onClose} 
            switchToSignup={() => setCurrentMode('signup')} 
          />
        ) : (
          <SignupForm 
            onClose={onClose}
            switchToLogin={() => setCurrentMode('login')}
          />
        )}
      </div>
    </div>
  );
}