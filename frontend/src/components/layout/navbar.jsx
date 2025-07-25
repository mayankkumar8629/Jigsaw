import { Link } from 'react-router-dom';
import AuthButtons from '../ui/AuthButton.jsx';

export default function Navbar({ onAuthButtonClick }) {
  return (
    <nav className="w-full px-6 py-5 absolute top-0 left-0 z-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="
            text-3xl md:text-4xl 
            font-extrabold 
            bg-gradient-to-r 
            from-blue-400 
            via-purple-500 
            to-blue-600 
            bg-clip-text 
            text-transparent
            tracking-tighter
            drop-shadow-lg
            hover:scale-105
            transition-transform
            duration-300
          "
        >
          Jigsaw
        </Link>
        <AuthButtons onButtonClick={onAuthButtonClick} />
      </div>
    </nav>
  );
}