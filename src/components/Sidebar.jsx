import React from 'react';

// Reusable Nav Item Component
const NavItem = ({ name, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className={`flex items-center w-full px-4 py-3 rounded-xl transition duration-150 ease-in-out ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' 
        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
    }`}
  >
    <span className="text-xl mr-3">{icon}</span>
    <span className="font-medium">{name}</span>
  </button>
);

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="w-64 bg-indigo-800 text-white p-6 flex flex-col min-h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-800 text-xl font-extrabold shadow-2xl">
          AI
        </div>
        <h2 className="text-2xl font-bold tracking-wider">FinAI</h2>
      </div>

      <nav className="space-y-3">
        <NavItem 
          name="Assistant" 
          icon="🤖" 
          isActive={currentPage === 'Assistant'} 
          onClick={setCurrentPage} 
        />
        <NavItem 
          name="Dashboard" 
          icon="📈" 
          isActive={currentPage === 'Dashboard'} 
          onClick={setCurrentPage} 
        />
      </nav>

      <div className="mt-auto pt-6 border-t border-indigo-700">
        <p className="text-xs text-indigo-400">© 2025 Financial AI. All rights reserved.</p>
      </div>
    </div>
  );
}