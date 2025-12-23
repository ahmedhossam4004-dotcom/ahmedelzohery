
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Worker, AbsenceLog, Team, Role } from './types';
import { INITIAL_WORKERS } from './constants';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WorkerGrid from './components/WorkerGrid';
import Reporting from './components/Reporting';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workers' | 'reports' | 'settings'>('dashboard');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [logs, setLogs] = useState<AbsenceLog[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Initialization
  useEffect(() => {
    const savedWorkers = localStorage.getItem('sg_workers');
    const savedLogs = localStorage.getItem('sg_logs');
    const savedUser = localStorage.getItem('sg_user');

    if (savedWorkers) setWorkers(JSON.parse(savedWorkers));
    else setWorkers(INITIAL_WORKERS);

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Save to Storage & Auto-Refresh simulation
  useEffect(() => {
    if (workers.length > 0) {
      localStorage.setItem('sg_workers', JSON.stringify(workers));
    }
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('sg_logs', JSON.stringify(logs));
  }, [logs]);

  // Global Timer Tick for Active Absences
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sg_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sg_user');
  };

  const toggleWorkerStatus = useCallback((workerId: string) => {
    const now = Date.now();
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        if (w.status === 'Active') {
          // Starting absence
          return { ...w, status: 'Away', lastAbsenceStart: now };
        } else {
          // Returning from absence
          const duration = Math.floor((now - (w.lastAbsenceStart || now)) / 1000);
          
          // Create Log entry
          const newLog: AbsenceLog = {
            id: `log-${now}`,
            workerId: w.id,
            startTime: w.lastAbsenceStart || now,
            endTime: now,
            duration,
            date: new Date().toISOString().split('T')[0]
          };
          setLogs(prevLogs => [newLog, ...prevLogs]);

          return { 
            ...w, 
            status: 'Active', 
            lastAbsenceStart: undefined, 
            totalAbsenceToday: w.totalAbsenceToday + duration 
          };
        }
      }
      return w;
    }));
  }, []);

  const addWorker = (newWorker: Worker) => {
    setWorkers(prev => [...prev, newWorker]);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        role={currentUser.role}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header 
          user={currentUser} 
          onLogout={handleLogout} 
          lastUpdated={lastUpdated} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <Dashboard workers={workers} logs={logs} />
          )}
          {activeTab === 'workers' && (
            <WorkerGrid 
              workers={workers} 
              onToggleStatus={toggleWorkerStatus} 
              role={currentUser.role}
            />
          )}
          {activeTab === 'reports' && (
            <Reporting logs={logs} workers={workers} />
          )}
          {activeTab === 'settings' && (
            <Settings workers={workers} onAddWorker={addWorker} />
          )}
        </main>

        {/* Status Bar */}
        <footer className="bg-white border-t px-6 py-2 flex justify-between items-center text-xs text-gray-500">
          <div>System Online • Google Sheets Synced</div>
          <div>Workers: {workers.length} | Teams: A, B, C | Active Session: 8 Hours Tracking</div>
        </footer>
      </div>
    </div>
  );
};

export default App;
