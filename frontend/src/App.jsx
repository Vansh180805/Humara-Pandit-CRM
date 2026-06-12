import React, { useState, useEffect } from 'react';
import Navbar from './components/Shared/Navbar';
import Login from './components/Shared/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Clients from './components/Clients/Clients';
import ClientProfile from './components/Clients/ClientProfile';
import Appointments from './components/Appointments/Appointments';
import Consultations from './components/Consultations/Consultations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hp_auth') === 'true';
  });
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('hp_user') || 'null');
  });
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState(null);
  
  // Theme State (Default to dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hp_theme') || 'dark';
  });

  // Effect to apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('hp_auth', 'true');
    localStorage.setItem('hp_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('hp_auth');
    localStorage.removeItem('hp_user');
    setCurrentTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Router matching currentTab state
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            setSelectedClientId={setSelectedClientId} 
          />
        );
      case 'clients':
        return (
          <Clients 
            setCurrentTab={setCurrentTab} 
            setSelectedClientId={setSelectedClientId} 
          />
        );
      case 'client-detail':
        return (
          <ClientProfile 
            clientId={selectedClientId} 
            onBack={() => setCurrentTab('clients')} 
          />
        );
      case 'appointments':
        return (
          <Appointments 
            setCurrentTab={setCurrentTab} 
            setSelectedClientId={setSelectedClientId} 
          />
        );
      case 'consultations':
        return (
          <Consultations 
            setCurrentTab={setCurrentTab} 
            setSelectedClientId={setSelectedClientId} 
          />
        );
      default:
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            setSelectedClientId={setSelectedClientId} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onLogout={handleLogout} 
        user={user} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 flex flex-col">
          {renderContent()}
        </main>
        <footer className="py-4 border-t border-slate-200 dark:border-slate-850 text-center text-xs text-slate-500 font-medium no-print bg-white dark:bg-slate-950">
          &copy; {new Date().getFullYear()} Humara Pandit. Order Management & Astrologer CRM.
        </footer>
      </div>
    </div>
  );
}

export default App;
