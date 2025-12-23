
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  lastUpdated: Date;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, lastUpdated }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full border">
          <i className="far fa-clock text-blue-500"></i>
          <span className="text-gray-600 font-medium">{lastUpdated.toLocaleTimeString()}</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-gray-500">
          <i className="fas fa-rotate text-[10px] animate-spin-slow"></i>
          <span>Auto-refreshing in 30s</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 border-r pr-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">{user.username}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <i className="fas fa-right-from-bracket text-lg"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
