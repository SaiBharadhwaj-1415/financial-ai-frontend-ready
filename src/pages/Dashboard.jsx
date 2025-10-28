import React, { useEffect, useState } from 'react';
import { REACT_BACKEND_URL } from '../config';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-xl shadow-lg border-l-4 ${color.border} bg-white hover:shadow-xl transition duration-300`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <span className={`text-2xl ${color.text}`}>{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQueries: 0,
    positiveSentiment: '0%',
    trendPredictions: '0/0',
    documentsAnalyzed: 0,
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const resp = await fetch(`${REACT_BACKEND_URL}/api/dashboard`);
        const data = await resp.json();
        setStats({
          totalQueries: data.totalQueries || 0,
          positiveSentiment: data.positiveSentiment || '0%',
          trendPredictions: data.trendPredictions || '0/0',
          documentsAnalyzed: data.documentsAnalyzed || 0,
        });
        setActivities(data.recent || []);

        // Prepare chart data for Recharts
        setChartData([
          { name: 'Sentiment (Positive %)', value: parseFloat(data.positiveSentiment) || 0 },
          { name: 'Documents', value: data.documentsAnalyzed || 0 },
          { name: 'Total Queries', value: data.totalQueries || 0 },
        ]);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    }
    fetchDashboard();
  }, []);

  // Colors for PieChart
  const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f87171'];

  // Trend vs Others Pie Data
  const trendParts = stats.trendPredictions.split('/');
  const trendCount = parseInt(trendParts[0]) || 0;
  const totalCount = parseInt(trendParts[1]) || 0;
  const pieData = [
    { name: 'Trend Predictions', value: trendCount },
    { name: 'Other Queries', value: Math.max(totalCount - trendCount, 0) },
  ];

  return (
    <div className="space-y-8">
      <header className="py-6 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800">Financial Overview Dashboard</h1>
        <p className="text-lg text-gray-500 mt-1">Real-time stats and assistant activity</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Queries" value={stats.totalQueries} icon="📊" color={{ border: 'border-indigo-500', text: 'text-indigo-600' }} />
        <StatCard title="Positive Sentiment" value={stats.positiveSentiment} icon="✅" color={{ border: 'border-green-500', text: 'text-green-600' }} />
        <StatCard title="Trend Predictions" value={stats.trendPredictions} icon="📈" color={{ border: 'border-yellow-500', text: 'text-yellow-600' }} />
        <StatCard title="Documents Analyzed" value={stats.documentsAnalyzed} icon="📄" color={{ border: 'border-cyan-500', text: 'text-cyan-600' }} />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Sentiment & Activity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Trend Breakdown */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Trend vs Other Queries</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Assistant Activity</h3>
        <ul className="space-y-3 text-sm">
          {activities.length === 0 && (
            <li className="text-gray-400 text-center py-4">No recent activities yet.</li>
          )}
          {activities.map((act, idx) => (
            <li key={idx} className="p-2 border-b border-gray-100 flex justify-between">
              <span>{act.type}: {act.label}</span>
              <span className={`${act.color} font-medium`}>{act.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
