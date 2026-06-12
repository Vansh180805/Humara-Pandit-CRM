import React from 'react';
import { LayoutDashboard, Users, Calendar, Clipboard, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = ({ currentTab, setCurrentTab, onLogout, user, theme, toggleTheme }) => {
  const role = user?.role || 'astrologer';
  const name = user?.name || 'User';

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col no-print h-auto md:h-screen sticky top-0 transition-colors duration-200">
      {/* Brand Section */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center shadow-sm">
            <span className="text-sm">🔮</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
              HUMARA PANDIT
            </h1>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 tracking-widest uppercase font-extrabold">
              {role === 'admin' ? 'Admin Board' : 'Astrologer CRM'}
            </p>
          </div>
        </div>

        {/* Day/Night Toggler in header (mobile only) */}
        <button
          onClick={toggleTheme}
          className="md:hidden p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-800 rounded-lg transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-grow p-4 space-y-1.5 flex flex-row md:flex-col items-center md:items-stretch overflow-x-auto md:overflow-x-visible shrink-0 md:shrink">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 ${
            currentTab === 'dashboard'
              ? 'bg-saffron-50 text-saffron-700 dark:bg-saffron-950/30 dark:text-saffron-400 border border-saffron-200/50 dark:border-saffron-800/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('clients')}
          className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 ${
            currentTab === 'clients' || currentTab === 'client-detail'
              ? 'bg-saffron-50 text-saffron-700 dark:bg-saffron-950/30 dark:text-saffron-400 border border-saffron-200/50 dark:border-saffron-800/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clients Directory</span>
        </button>

        <button
          onClick={() => setCurrentTab('appointments')}
          className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 ${
            currentTab === 'appointments'
              ? 'bg-saffron-50 text-saffron-700 dark:bg-saffron-950/30 dark:text-saffron-400 border border-saffron-200/50 dark:border-saffron-800/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments</span>
        </button>

        {role === 'astrologer' && (
          <button
            onClick={() => setCurrentTab('consultations')}
            className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 ${
              currentTab === 'consultations'
                ? 'bg-saffron-50 text-saffron-700 dark:bg-saffron-950/30 dark:text-saffron-400 border border-saffron-200/50 dark:border-saffron-800/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>Consultations</span>
          </button>
        )}
      </nav>

      {/* User profile controls at bottom */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between hidden md:flex bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 uppercase shadow-inner text-xs border border-slate-350 dark:border-slate-750">
            {name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[100px]">{name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold leading-tight mt-0.5">{role}</span>
          </div>
        </div>
        
        {/* Actions inside sidebar */}
        <div className="flex items-center space-x-1">
          {/* Day/Night Toggler inside sidebar */}
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-md transition-all"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="p-1.5 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 rounded-md transition-all"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
