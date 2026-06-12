import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/api';
import { Users, Calendar, Clock, AlertTriangle, ArrowRight, Clipboard, Sparkles } from 'lucide-react';

const Dashboard = ({ setCurrentTab, setSelectedClientId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDashboardStats();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to load dashboard metrics.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard metrics. Is the backend server online?');
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = (id) => {
    if (!id) return;
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  const safeFormatDate = (dateStr, options = { month: 'short', day: 'numeric' }) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 min-h-[50vh] transition-colors duration-200">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center bg-slate-50 dark:bg-slate-900 min-h-[50vh] flex items-center justify-center transition-colors duration-200">
        <div className="max-w-md w-full glass-panel p-6 rounded-lg border border-red-500/20">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button onClick={fetchStats} className="bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const summary = stats?.stats || { totalClients: 0, todayConsultations: 0, upcomingAppointments: 0, pendingFollowups: 0 };
  const recentClients = stats?.recentClients || [];
  const recentConsultations = stats?.recentConsultations || [];
  const upcomingList = stats?.upcomingList || [];
  const remediesAnalytics = stats?.remediesAnalytics || [];

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full transition-colors duration-200">
      
      {/* Welcome banner */}
      <div className="glass-panel p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Humara Pandit CRM Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Astrology customer relations, appointments scheduler, and remedy dispatches.</p>
        </div>
        <button 
          onClick={() => setCurrentTab('clients')} 
          className="flex items-center space-x-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-sm text-xs"
        >
          <span>Manage Clients</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Clients */}
        <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Clients</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{summary.totalClients}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Today's Consultations */}
        <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Consult.</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{summary.todayConsultations}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Clipboard className="w-4 h-4" />
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Upcoming</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{summary.upcomingAppointments}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Muted followups */}
        <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Follow-ups</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{summary.pendingFollowups}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <div className="glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              Upcoming Consultations
            </h3>
            <button onClick={() => setCurrentTab('appointments')} className="text-xs text-saffron-600 dark:text-saffron-400 hover:underline font-bold">View All</button>
          </div>

          <div className="flex-grow divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[320px] mt-2">
            {upcomingList.map((app) => (
              <div 
                key={app._id} 
                onClick={() => handleClientClick(app.clientId?._id)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-md transition-all cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{app.clientId ? app.clientId.name : 'Unknown Client'}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">📞 {app.clientId ? app.clientId.phone : ''}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                    {safeFormatDate(app.date)}
                  </span>
                </div>
              </div>
            ))}
            {upcomingList.length === 0 && (
              <div className="text-center py-16 text-slate-400 dark:text-slate-550 text-xs italic">No upcoming scheduled appointments.</div>
            )}
          </div>
        </div>

        {/* Recent consultations */}
        <div className="glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
              <Clipboard className="w-4 h-4 mr-2 text-slate-500" />
              Recent Consultations
            </h3>
            <button onClick={() => setCurrentTab('consultations')} className="text-xs text-saffron-600 dark:text-saffron-400 hover:underline font-bold">View All</button>
          </div>

          <div className="flex-grow divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[320px] mt-2">
            {recentConsultations.map((cons) => (
              <div 
                key={cons._id} 
                onClick={() => handleClientClick(cons.clientId?._id || cons.clientId)}
                className="py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-md transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-saffron-600 dark:text-saffron-400">
                    {cons.clientId ? (typeof cons.clientId === 'object' ? cons.clientId.name : (cons.clientName || 'Client')) : 'Unknown Client'}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {safeFormatDate(cons.date)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-655 dark:text-slate-350 line-clamp-1">{cons.notes}</p>
              </div>
            ))}
            {recentConsultations.length === 0 && (
              <div className="text-center py-16 text-slate-400 dark:text-slate-550 text-xs italic">No consultations logged yet.</div>
            )}
          </div>
        </div>

        {/* Remedy Analytics */}
        <div className="glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-slate-500" />
              Recommended Remedies
            </h3>
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
              OMS Analytics
            </span>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[320px] mt-2 space-y-3">
            {remediesAnalytics.map((rem, idx) => {
              const maxCount = remediesAnalytics[0]?.count || 1;
              const percent = Math.min(100, Math.round((rem.count / maxCount) * 100));
              
              let emoji = '💎';
              if (rem.name.toLowerCase().includes('rudraksha')) emoji = '📿';
              if (rem.name.toLowerCase().includes('crystal') || rem.name.toLowerCase().includes('quartz') || rem.name.toLowerCase().includes('amethyst')) emoji = '🔮';
              
              return (
                <div key={idx} className="space-y-1 px-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {emoji} {rem.name}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-[9px]">
                      {rem.count} logs
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
                    <div 
                      style={{ width: `${percent}%` }}
                      className="bg-saffron-500 h-full rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              );
            })}
            {remediesAnalytics.length === 0 && (
              <div className="text-center py-16 text-slate-450 dark:text-slate-500 text-xs italic">No remedies logged yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
