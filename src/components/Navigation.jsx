import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, BarChart3, User } from 'lucide-react';

const Navigation = ({ user }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'DASHBOARD' },
    { path: '/add-activity', icon: Plus, label: 'ADD' },
    { path: '/progress', icon: BarChart3, label: 'PROGRESS' },
    { path: '/profile', icon: User, label: 'PROFILE' }
  ];

  return (
    <nav className="neo-brutalist bg-white dark:bg-black p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="neo-brutalist bg-blue-500 text-white p-2">
            <span className="text-xl font-black">💪</span>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              BRO PROGRESS
            </h1>
            {user && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                LEVEL {user.level} • {user.display_name}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`neo-brutalist px-4 py-2 flex items-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-black text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="neo-brutalist p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4">
        <div className="grid grid-cols-2 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`neo-brutalist p-3 flex items-center justify-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-black text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 