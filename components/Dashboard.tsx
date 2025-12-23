
import React from 'react';
import { Worker, AbsenceLog } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  workers: Worker[];
  logs: AbsenceLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ workers, logs }) => {
  const activeCount = workers.filter(w => w.status === 'Active').length;
  const awayCount = workers.filter(w => w.status === 'Away').length;
  const productivity = workers.length > 0 ? Math.round((activeCount / workers.length) * 100) : 0;

  const teamStats = ['A', 'B', 'C'].map(team => {
    const teamWorkers = workers.filter(w => w.team === team);
    const teamActive = teamWorkers.filter(w => w.status === 'Active').length;
    return {
      name: `Team ${team}`,
      active: teamActive,
      away: teamWorkers.length - teamActive,
      total: teamWorkers.length
    };
  });

  const chartData = [
    { name: 'Active', value: activeCount, color: '#3b82f6' },
    { name: 'Away', value: awayCount, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <i className="fas fa-users text-2xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Workers</p>
            <p className="text-2xl font-bold">{workers.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <i className="fas fa-check-circle text-2xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Currently Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">
            <i className="fas fa-user-clock text-2xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Currently Away</p>
            <p className="text-2xl font-bold text-red-600">{awayCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <i className="fas fa-percent text-2xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Productivity</p>
            <p className="text-2xl font-bold text-purple-600">{productivity}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Charts */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <i className="fas fa-chart-pie text-blue-500"></i>
            <span>Current Status</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Active ({activeCount})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Away ({awayCount})</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <i className="fas fa-chart-bar text-purple-500"></i>
            <span>Team Productivity Breakdown</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="active" name="Active Workers" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="away" name="Away Workers" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center space-x-2">
            <i className="fas fa-history text-orange-500"></i>
            <span>Recent Absence Logs</span>
          </h3>
          <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Worker / PC</th>
                <th className="px-6 py-4 font-semibold">Start Time</th>
                <th className="px-6 py-4 font-semibold">End Time</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.slice(0, 5).map(log => {
                const worker = workers.find(w => w.id === log.workerId);
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                          {worker?.pcNumber.replace('PC-', '')}
                        </div>
                        <span className="font-medium text-gray-900">{worker?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(log.startTime).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.endTime ? new Date(log.endTime).toLocaleTimeString() : '--'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                        {Math.floor(log.duration / 60)}m {log.duration % 60}s
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center space-x-1.5 text-green-600 text-xs font-bold">
                        <i className="fas fa-check-circle"></i>
                        <span>Logged</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <i className="fas fa-folder-open text-4xl mb-3 block"></i>
                    No absence logs yet for this shift.
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

export default Dashboard;
