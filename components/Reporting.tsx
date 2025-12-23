
import React, { useState, useMemo } from 'react';
import { AbsenceLog, Worker } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface ReportingProps {
  logs: AbsenceLog[];
  workers: Worker[];
}

const Reporting: React.FC<ReportingProps> = ({ logs, workers }) => {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => log.date === filterDate);
  }, [logs, filterDate]);

  const generateAIInsight = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summary = `
        Shift Data for ${filterDate}:
        Total Absences: ${filteredLogs.length}
        Total Duration: ${filteredLogs.reduce((acc, log) => acc + log.duration, 0)} seconds
        Active Workers: ${workers.filter(w => w.status === 'Active').length}
        Worker names: ${workers.map(w => w.name).join(', ')}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this shift data and provide 3 brief bullet points for management: ${summary}`,
        config: {
          systemInstruction: 'You are a workforce operations analyst. Be concise, professional, and focus on productivity trends.'
        }
      });
      setAiInsight(response.text || 'No insights available.');
    } catch (err) {
      setAiInsight("Unable to generate AI insights at this time. Please check your API configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'PC Number', 'Worker Name', 'Start Time', 'End Time', 'Duration (Sec)', 'Team'];
    const rows = filteredLogs.map(log => {
      const w = workers.find(work => work.id === log.workerId);
      return [
        log.date,
        w?.pcNumber,
        w?.name,
        new Date(log.startTime).toLocaleTimeString(),
        log.endTime ? new Date(log.endTime).toLocaleTimeString() : 'In Progress',
        log.duration,
        w?.team
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `shift_report_${filterDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Select Shift Date</label>
            <input 
              type="date" 
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <button 
            onClick={generateAIInsight}
            disabled={isGenerating}
            className="mt-5 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <i className="fas fa-spinner animate-spin"></i>
            ) : (
              <i className="fas fa-wand-magic-sparkles"></i>
            )}
            <span>{isGenerating ? 'Analyzing...' : 'AI Shift Analysis'}</span>
          </button>
        </div>

        <button 
          onClick={exportCSV}
          className="flex items-center space-x-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-200 transition-all"
        >
          <i className="fas fa-file-csv"></i>
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* AI Insight Box */}
      {aiInsight && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-blue-100 text-8xl opacity-50 group-hover:scale-110 transition-transform duration-500">
            <i className="fas fa-robot"></i>
          </div>
          <div className="relative z-10">
            <h4 className="flex items-center space-x-2 text-indigo-900 font-bold mb-3">
              <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <i className="fas fa-sparkles text-indigo-500"></i>
              </span>
              <span>AI Operational Insights</span>
            </h4>
            <div className="text-sm text-indigo-800/80 leading-relaxed whitespace-pre-line bg-white/40 p-4 rounded-xl backdrop-blur-sm border border-white/50">
              {aiInsight}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Historical Shift Logs</h3>
          <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-500">
            {filteredLogs.length} Records Found
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">Worker Profile</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Interval</th>
                <th className="px-6 py-4">Total Duration</th>
                <th className="px-6 py-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map(log => {
                const w = workers.find(work => work.id === log.workerId);
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-sm">
                          {w?.pcNumber.replace('PC-', '')}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{w?.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{w?.pcNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black text-white ${
                        w?.team === 'A' ? 'bg-blue-600' : w?.team === 'B' ? 'bg-purple-600' : 'bg-emerald-600'
                      }`}>
                        TEAM {w?.team}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                        <i className="far fa-calendar-check text-blue-400"></i>
                        <span>{new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <i className="fas fa-arrow-right text-[10px] text-gray-300"></i>
                        <span>{log.endTime ? new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-bold text-gray-700">
                        {Math.floor(log.duration / 60)}m {log.duration % 60}s
                      </div>
                      <div className="h-1 w-16 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (log.duration / 1800) * 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 italic">No notes provided</span>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-database text-2xl"></i>
                      </div>
                      <p className="font-bold text-gray-500">No shift logs recorded for this date</p>
                      <p className="text-sm">Data resets every 24 hours at the start of shift.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
