import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/api';
import { 
  Users, Calendar, Clock, AlertTriangle, ArrowRight, Clipboard, Sparkles, 
  UserPlus, BookOpen, PlusCircle, BarChart3, Settings, ClipboardList 
} from 'lucide-react';

const Dashboard = ({ setCurrentTab, setSelectedClientId, user }) => {
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

  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full transition-colors duration-200">
      
      {/* Welcome banner */}
      <div className={`glass-panel p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 relative overflow-hidden transition-all duration-300 ${
        isAdmin 
          ? 'border-slate-200 dark:border-slate-800 border-l-rose-500 dark:border-l-rose-500' 
          : 'border-slate-200 dark:border-slate-800 border-l-teal-500 dark:border-l-teal-500'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-250 dark:border-rose-900/50">
                <BarChart3 className="w-3 h-3 mr-1" /> ADMIN ANALYTICS MODE
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-250 dark:border-teal-900/50">
                <Settings className="w-3 h-3 mr-1" /> ASTROLOGER OPERATIONS MODE
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Active Connection: MongoDB Atlas
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isAdmin ? 'Humara Pandit — System Analytics Console' : 'Humara Pandit — Daily Operations Dashboard'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-2xl">
            {isAdmin 
              ? 'This view is optimized for aggregated metrics, remedy recommendation counts (OMS analytics), and system-wide scheduler logistics.'
              : 'This view is optimized for live appointment queues, instant client lookup, pending follow-ups, and log operations.'}
          </p>
        </div>
        <button 
          onClick={() => setCurrentTab('clients')} 
          className={`flex items-center space-x-2 font-bold px-4 py-2 rounded-lg transition-all shadow-sm text-xs text-white shrink-0 ${
            isAdmin 
              ? 'bg-rose-500 hover:bg-rose-600' 
              : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          <span>{isAdmin ? 'System Directories' : 'My Clients'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            {/* Admin Metric 1: Total Clients */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-rose-450/40 dark:hover:border-rose-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Clients</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.totalClients}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Metric 2: Total Appointments */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-rose-450/40 dark:hover:border-rose-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Appointments</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.totalAppointments || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Metric 3: Completed Consultations */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-rose-450/40 dark:hover:border-rose-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed Consultations</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.completedConsultations || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                <Clipboard className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Metric 4: Pending Follow-ups */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-rose-450/40 dark:hover:border-rose-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Follow-ups</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.pendingFollowups}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Astrologer Metric 1: Today's Appointments */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-teal-450/40 dark:hover:border-teal-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Appointments</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.todayAppointments || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/25 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center text-teal-500 dark:text-teal-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            {/* Astrologer Metric 2: My Clients */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-teal-450/40 dark:hover:border-teal-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">My Clients</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.totalClients}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/25 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center text-teal-500 dark:text-teal-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Astrologer Metric 3: Today's Consultations */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-teal-450/40 dark:hover:border-teal-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Consult.</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.todayConsultations || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/25 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center text-teal-500 dark:text-teal-400 shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>

            {/* Astrologer Metric 4: Pending Follow-ups */}
            <div className="glass-panel p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-teal-450/40 dark:hover:border-teal-900/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Follow-ups</p>
                <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50">{summary.pendingFollowups}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/25 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center text-teal-500 dark:text-teal-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Grid: Role Specific Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdmin ? (
          // Admin Grid (Analytics focus)
          <>
            {/* 1. Remedy Analytics (OMS) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-saffron-550" />
                  Most Recommended Remedies (OMS Analytics)
                </h3>
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                  System Stats
                </span>
              </div>

              <div className="flex-grow overflow-y-auto max-h-[320px] mt-4 space-y-4">
                {remediesAnalytics.map((rem, idx) => {
                  const maxCount = remediesAnalytics[0]?.count || 1;
                  const percent = Math.min(100, Math.round((rem.count / maxCount) * 100));
                  
                  let emoji = '💎';
                  if (rem.name.toLowerCase().includes('rudraksha')) emoji = '📿';
                  if (rem.name.toLowerCase().includes('crystal') || rem.name.toLowerCase().includes('quartz') || rem.name.toLowerCase().includes('amethyst')) emoji = '🔮';
                  
                  return (
                    <div key={idx} className="space-y-1.5 px-1 font-semibold">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-700 dark:text-slate-200">
                          {emoji} {rem.name}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[9px]">
                          {rem.count} recommendations
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
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

            {/* 2. Upcoming Logistics */}
            <div className="glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                  Upcoming Sessions Distribution
                </h3>
                <button onClick={() => setCurrentTab('appointments')} className="text-xs text-saffron-600 dark:text-saffron-400 hover:underline font-bold">View List</button>
              </div>

              <div className="flex-grow divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[320px] mt-2">
                {upcomingList.map((app) => (
                  <div 
                    key={app._id} 
                    onClick={() => handleClientClick(app.clientId?._id)}
                    className="py-3 flex items-center justify-between hover:bg-slate-55 dark:hover:bg-slate-800/40 px-2 rounded-md transition-all cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{app.clientId ? app.clientId.name : 'Unknown Client'}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">👤 {app.clientId ? app.clientId.phone : ''}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 dark:text-slate-305 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                      {safeFormatDate(app.date)}
                    </span>
                  </div>
                ))}
                {upcomingList.length === 0 && (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-550 text-xs italic">No upcoming sessions.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Astrologer Grid (Operations focus)
          <>
            {/* 1. Today's Appointments Table */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-saffron-550" />
                  Today's Consultations Schedule
                </h3>
                <button onClick={() => setCurrentTab('appointments')} className="text-xs text-saffron-650 dark:text-saffron-400 hover:underline font-bold">Book Slots</button>
              </div>

              <div className="flex-grow divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[320px] mt-2">
                {upcomingList.map((app) => (
                  <div 
                    key={app._id} 
                    onClick={() => handleClientClick(app.clientId?._id)}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-md transition-all cursor-pointer font-semibold"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{app.clientId ? app.clientId.name : 'Unknown Client'}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">at {app.time} &bull; {app.clientId ? app.clientId.phone : ''}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded">
                      {app.status}
                    </span>
                  </div>
                ))}
                {upcomingList.length === 0 && (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-550 text-xs italic">No consultations scheduled.</div>
                )}
              </div>
            </div>

            {/* 2. Operations Quick Actions Center */}
            <div className="glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center">
                    <Clipboard className="w-4 h-4 mr-2 text-slate-500" />
                    Quick Actions Center
                  </h3>
                </div>
                
                <div className="space-y-2.5 text-xs font-bold">
                  <button 
                    onClick={() => setCurrentTab('clients')} 
                    className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-teal-500/30 transition-all flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center"><UserPlus className="w-4 h-4 mr-2 text-teal-500" /> Register New Client</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('consultations')} 
                    className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-teal-500/30 transition-all flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center"><PlusCircle className="w-4 h-4 mr-2 text-teal-500" /> Log Consultation Session</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('appointments')} 
                    className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-teal-500/30 transition-all flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-teal-500" /> Book Consultation Slot</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-medium">
                Tip: Clicking on client rows across directories redirects you directly to their aggregated history profile.
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Recent Consultation logs (Full Width/Bottom view for details audit) */}
      <div className="glass-panel p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center">
            <Clipboard className="w-4 h-4 mr-2 text-slate-500" />
            {isAdmin ? 'System Audit Log: Recent Consultation Sessions' : 'Recent Consultations History'}
          </h3>
          <button onClick={() => setCurrentTab('consultations')} className="text-xs text-saffron-600 dark:text-saffron-400 hover:underline font-bold">View History</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {recentConsultations.slice(0, 4).map((cons) => (
            <div 
              key={cons._id} 
              onClick={() => handleClientClick(cons.clientId?._id || cons.clientId)}
              className="p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-55 dark:hover:bg-slate-800/40 transition-colors cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-saffron-600 dark:text-saffron-400 hover:underline">
                  👤 {cons.clientId ? (typeof cons.clientId === 'object' ? cons.clientId.name : (cons.clientName || 'Client')) : 'Unknown Client'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {safeFormatDate(cons.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-[11px] text-slate-605 dark:text-slate-350 line-clamp-2 leading-relaxed font-normal">{cons.notes}</p>
            </div>
          ))}
          {recentConsultations.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-450 dark:text-slate-550 text-xs italic">No consultations logged yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
