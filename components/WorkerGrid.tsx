
import React, { useState, useMemo, useEffect } from 'react';
import { Worker, Team, Role } from '../types';
import { TEAM_COLORS } from '../constants';

interface WorkerGridProps {
  workers: Worker[];
  onToggleStatus: (id: string) => void;
  role: Role;
}

const WorkerGrid: React.FC<WorkerGridProps> = ({ workers, onToggleStatus, role }) => {
  const [activeTeam, setActiveTeam] = useState<Team | 'ALL'>('A');
  const [search, setSearch] = useState('');

  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchesTeam = activeTeam === 'ALL' || w.team === activeTeam;
      const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                           w.pcNumber.toLowerCase().includes(search.toLowerCase());
      return matchesTeam && matchesSearch;
    });
  }, [workers, activeTeam, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Team Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          {['ALL', 'A', 'B', 'C'].map((team) => (
            <button
              key={team}
              onClick={() => setActiveTeam(team as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTeam === team 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {team === 'ALL' ? 'All Workers' : `Team ${team}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search PC or Name..."
            className="pl-11 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {filteredWorkers.map(worker => (
          <WorkerCard 
            key={worker.id} 
            worker={worker} 
            onToggle={() => onToggleStatus(worker.id)}
            canControl={role !== 'User'}
          />
        ))}
      </div>
      
      {filteredWorkers.length === 0 && (
        <div className="bg-white py-20 text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
          <i className="fas fa-users-slash text-5xl mb-4"></i>
          <p className="text-lg">No workers found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

const WorkerCard: React.FC<{ worker: Worker; onToggle: () => void, canControl: boolean }> = ({ worker, onToggle, canControl }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (worker.status === 'Away' && worker.lastAbsenceStart) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - worker.lastAbsenceStart!) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [worker.status, worker.lastAbsenceStart]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = elapsed > 900; // 15 mins

  return (
    <div className={`relative group bg-white rounded-2xl border transition-all duration-300 ${
      worker.status === 'Away' 
      ? 'border-red-200 shadow-md ring-1 ring-red-100' 
      : 'border-gray-100 shadow-sm hover:shadow-md'
    }`}>
      {/* Team Ribbon */}
      <div className={`absolute top-4 right-0 w-12 h-6 rounded-l-full flex items-center justify-center text-[10px] font-black text-white ${TEAM_COLORS[worker.team]}`}>
        {worker.team}
      </div>

      <div className="p-5">
        <div className="flex items-start space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg shadow-blue-100 ${
            worker.status === 'Active' ? 'bg-blue-500' : 'bg-red-500'
          }`}>
            <span className="text-[10px] leading-tight opacity-80 uppercase">PC</span>
            <span className="text-lg leading-tight">{worker.pcNumber.split('-')[1]}</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 truncate max-w-[120px]" title={worker.name}>{worker.name}</h4>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${worker.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                worker.status === 'Active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {worker.status}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Timer UI */}
        <div className={`mb-4 p-3 rounded-xl flex items-center justify-between ${
          worker.status === 'Away' 
          ? (isWarning ? 'bg-orange-50 animate-pulse' : 'bg-red-50')
          : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2">
            <i className={`fas fa-stopwatch text-sm ${worker.status === 'Away' ? 'text-red-500' : 'text-gray-400'}`}></i>
            <span className={`font-mono font-bold text-lg ${worker.status === 'Away' ? 'text-red-600' : 'text-gray-400'}`}>
              {worker.status === 'Away' ? formatTime(elapsed) : '00:00'}
            </span>
          </div>
          {worker.status === 'Away' && isWarning && (
            <i className="fas fa-triangle-exclamation text-orange-500 text-xs" title="Extended absence threshold reached"></i>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={!canControl}
          onClick={onToggle}
          className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
            worker.status === 'Active'
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-green-600 text-white hover:bg-green-700'
          } ${!canControl ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {worker.status === 'Active' ? (
            <>
              <i className="fas fa-play text-[10px]"></i>
              <span>START ABSENCE</span>
            </>
          ) : (
            <>
              <i className="fas fa-undo text-[10px]"></i>
              <span>RECORD RETURN</span>
            </>
          )}
        </button>

        {/* Today's total summary */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium">
          <span>Today's Total:</span>
          <span className="text-gray-600">{formatTime(worker.totalAbsenceToday)}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkerGrid;
