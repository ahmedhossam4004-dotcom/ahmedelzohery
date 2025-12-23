
import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onToggle: () => void;
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange, onToggle, role }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'workers', label: 'Worker Tracking', icon: 'fa-users' },
    { id: 'reports', label: 'Reports & Analytics', icon: 'fa-file-lines' },
    { id: 'settings', label: 'Configuration', icon: 'fa-gears', roles: ['Admin', 'Team Lead'] },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
        <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-halved"></i>
          </div>
          <span className="font-bold text-lg whitespace-nowrap">ShiftGuard</span>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <i className={`fas ${isOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(role)) return null;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
              <span className={`ml-4 font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-4">
        <div className={`bg-slate-800 rounded-2xl p-4 transition-all ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400 font-medium">8HR SHIFT ACTIVE</span>
          </div>
          <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[65%]"></div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
            <span>Progress: 5h 12m</span>
            <span>65%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
