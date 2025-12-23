
import React, { useState } from 'react';
import { Worker, Team } from '../types';

interface SettingsProps {
  workers: Worker[];
  onAddWorker: (worker: Worker) => void;
}

const Settings: React.FC<SettingsProps> = ({ workers, onAddWorker }) => {
  const [newWorker, setNewWorker] = useState({ name: '', pcNumber: '', team: 'A' as Team });
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.pcNumber) return;
    
    onAddWorker({
      id: `worker-${Date.now()}`,
      ...newWorker,
      status: 'Active',
      totalAbsenceToday: 0
    });
    setNewWorker({ name: '', pcNumber: '', team: 'A' });
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <i className="fas fa-sliders-h text-blue-600"></i>
          <span>Global Shift Parameters</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Shift Timing</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm font-bold text-gray-700">Total Shift Duration</span>
                <span className="text-blue-600 font-mono font-bold">08:00:00</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm font-bold text-gray-700">Break Threshold (Warning)</span>
                <div className="flex items-center space-x-2">
                  <input type="number" defaultValue={15} className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-right font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                  <span className="text-xs text-gray-400">MINS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">System Health</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 text-green-700">
                <span className="text-sm font-bold">Google Sheets Sync</span>
                <span className="text-xs px-2 py-1 bg-white rounded-full font-black border border-green-200 uppercase tracking-widest">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                <span className="text-sm font-bold">Last Auto-Backup</span>
                <span className="text-xs font-bold">12:45 PM Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Worker Database</h3>
            <p className="text-sm text-gray-400">Manage your workforce of {workers.length} members.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all active:scale-95"
          >
            <i className="fas fa-user-plus"></i>
            <span>ADD NEW WORKER</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
        <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700/70 mb-6">These actions are irreversible. Proceed with extreme caution.</p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-2 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">
            RESET ALL TIMERS
          </button>
          <button className="px-6 py-2 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">
            DELETE SHIFT HISTORY
          </button>
        </div>
      </div>

      {/* Add Worker Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Register New Worker</h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter worker's full name"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">PC Number</label>
                  <div className="relative">
                    <i className="fas fa-desktop absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. PC-67"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newWorker.pcNumber}
                      onChange={(e) => setNewWorker({...newWorker, pcNumber: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Team Assignment</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold"
                    value={newWorker.team}
                    onChange={(e) => setNewWorker({...newWorker, team: e.target.value as Team})}
                  >
                    <option value="A">Team A</option>
                    <option value="B">Team B</option>
                    <option value="C">Team C</option>
                    <option value="D">Team D</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  SAVE WORKER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-up { animation: scale-up 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default Settings;
