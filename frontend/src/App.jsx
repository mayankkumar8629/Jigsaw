import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthModal from './components/auth/authModel.jsx';
import Navbar from './components/layout/navbar.jsx';


function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  return (
    <BrowserRouter>
      {/* Navbar with auth handler */}
      <Navbar 
        onAuthButtonClick={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }} 
      />
      
      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal 
          mode={authMode}
          onClose={() => setAuthModalOpen(false)} 
        />
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}



export default App
