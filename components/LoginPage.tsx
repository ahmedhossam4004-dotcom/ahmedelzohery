
import React, { useState } from 'react';
import { User, Role } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo credentials
    if (username === 'admin' && password === 'admin') {
      onLogin({ id: '1', username: 'Administrator', role: 'Admin' });
    } else if (username === 'lead' && password === 'lead') {
      onLogin({ id: '2', username: 'Team Lead John', role: 'Team Lead' });
    } else if (username === 'user' && password === 'user') {
      onLogin({ id: '3', username: 'Standard User', role: 'User' });
    } else {
      setError('Invalid username or password. Try: admin/admin, lead/lead, or user/user.');
    }
  };

  const quickLogin = (type: string) => {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('admin');
    } else if (type === 'lead') {
      setUsername('lead');
      setPassword('lead');
    } else {
      setUsername('user');
      setPassword('user');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-6">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/20 mb-6 transform rotate-12">
            <i className="fas fa-shield-halved text-4xl text-white -rotate-12"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">ShiftGuard<span className="text-blue-500">Pro</span></h1>
          <p className="text-slate-400 font-medium">Workforce Management & Tracking System</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-10 rounded-[40px] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                <input 
                  type="text" 
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                <input 
                  type="password" 
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2">
                <i className="fas fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              SIGN IN TO DASHBOARD
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Test Access</p>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => quickLogin('admin')}
                className="py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-white text-xs font-bold transition-all"
              >
                ADMIN
              </button>
              <button 
                onClick={() => quickLogin('lead')}
                className="py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-white text-xs font-bold transition-all"
              >
                LEAD
              </button>
              <button 
                onClick={() => quickLogin('user')}
                className="py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-white text-xs font-bold transition-all"
              >
                USER
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-500 text-sm font-medium">
          Secured by ShiftGuard Enterprise v4.2.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
