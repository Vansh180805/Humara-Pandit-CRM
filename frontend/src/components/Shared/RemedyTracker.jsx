import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/api';
import { Sparkles, Calendar, User, IndianRupee, Clock, CheckCircle } from 'lucide-react';

const RemedyTracker = ({ setCurrentTab, setSelectedClientId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch remedy bookings. Is backend server online?');
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = (id) => {
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center text-red-400 font-semibold">{error}</div>
    );
  }

  const upcomingPujas = data?.upcomingPujas || [];

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Remedies & Puja Booking Log</h2>
        <p className="text-slate-400 text-sm mt-0.5">Track gemstone recommendations and schedule Vedic rituals for client prosperity</p>
      </div>

      {/* Grid: Active Pujas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingPujas.map((puja, index) => (
          <div 
            key={index} 
            onClick={() => handleClientClick(puja.clientId)}
            className="glass-panel p-5 rounded-2xl border border-white/5 cursor-pointer glass-panel-hover flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-saffron-400 bg-saffron-500/10 border border-saffron-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Puja Booking
                </span>
                <span className="flex items-center text-xs text-amber-400 font-semibold">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Scheduled
                </span>
              </div>

              {/* Title & Client */}
              <div>
                <h3 className="text-base font-bold text-slate-100">{puja.pujaName}</h3>
                <div className="flex items-center text-xs text-slate-400 mt-2">
                  <User className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>Client: <span className="text-saffron-400 font-semibold">{puja.clientName}</span></span>
                </div>
              </div>

              {/* Timing */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Date:</span>
                </div>
                <span className="font-semibold text-slate-200">
                  {new Date(puja.dateScheduled).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-5 flex justify-between items-center">
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                {puja.cost.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-semibold text-saffron-500 hover:underline">View Client Timeline &rarr;</span>
            </div>
          </div>
        ))}

        {upcomingPujas.length === 0 && (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5">
            <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 font-medium text-sm">No active puja bookings recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemedyTracker;
