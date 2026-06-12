import React, { useState, useEffect } from 'react';
import { getAppointments, createAppointment, getClients } from '../../services/api';
import { Calendar, User, Clock, AlertCircle, Plus } from 'lucide-react';

const Appointments = ({ setCurrentTab, setSelectedClientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appRes = await getAppointments();
      const clientRes = await getClients();
      
      if (appRes.success) setAppointments(appRes.data);
      if (clientRes.success) setClients(clientRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch appointments. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !date || !time) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setAdding(true);
      const res = await createAppointment({ clientId, date, time, status });
      if (res.success) {
        setClientId('');
        setDate('');
        setTime('');
        setStatus('Scheduled');
        
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to schedule appointment');
    } finally {
      setAdding(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-saffron-500/10 text-saffron-600 dark:text-saffron-400 border border-saffron-500/20 dark:border-saffron-500/30';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 dark:border-slate-500/30';
    }
  };

  const handleClientClick = (id) => {
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full transition-colors duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Appointment Scheduler</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Schedule client consultations and manage status tags</p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-505/10 border border-red-500/20 text-red-700 dark:text-red-200 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 dark:text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Create Form + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create appointment Form */}
        <div className="glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Plus className="w-4 h-4 mr-1.5 text-saffron-600 dark:text-saffron-400" />
            Schedule Appointment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Select Client *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                <option value="">-- Choose Client --</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name} ({client.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Appointment Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Appointment Time *</label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:bg-saffron-500/50 text-white font-bold py-2 rounded-lg text-xs transition-all shadow-sm"
            >
              {adding ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </form>
        </div>

        {/* Appointments Table List */}
        <div className="lg:col-span-2 glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Active Appointment Directory</h3>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {appointments.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => handleClientClick(app.clientId?._id)}
                          className="font-bold text-slate-900 dark:text-slate-100 hover:underline hover:text-saffron-600 dark:hover:text-saffron-400 cursor-pointer text-sm"
                        >
                          {app.clientId ? app.clientId.name : 'Deleted Client'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {app.clientId ? app.clientId.phone : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-900 dark:text-slate-100">
                          {new Date(app.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">at {app.time}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-slate-400 dark:text-slate-500 italic">
                        No appointments scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Appointments;
