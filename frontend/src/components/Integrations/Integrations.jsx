import React, { useEffect, useState } from 'react';
import { getIntegrationLogs } from '../../services/api';
import { Settings, RefreshCcw, Link2, Database, MessageSquare, Truck, Layers, Activity } from 'lucide-react';

const Integrations = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getIntegrationLogs();
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sync logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      fetchLogs(); // refresh logs
    }, 1500);
  };

  // Integration card data
  const platforms = [
    {
      name: 'Shopify Storefront',
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      status: 'Connected',
      endpoint: 'humarapandit.myshopify.com',
      description: 'Synchronizes product inventory, gemstone metadata, and imports remedy customer orders.',
      lastSync: '30s ago'
    },
    {
      name: 'WhatsApp Business API',
      icon: <MessageSquare className="w-6 h-6 text-green-400" />,
      status: 'Connected',
      endpoint: 'WhatsApp Cloud API v18.0',
      description: 'Delivers PDF Kundli charts, shipping tracking links, and ritual scheduling reminders automatically.',
      lastSync: '2m ago'
    },
    {
      name: 'Zoho CRM Sync',
      icon: <Database className="w-6 h-6 text-blue-400" />,
      status: 'Connected',
      endpoint: 'zoho.in/crm/v2/contacts',
      description: 'Maps client records, consultations, and tracks astrologer white-label commission ledger entries.',
      lastSync: '12m ago'
    },
    {
      name: 'Shiprocket Fulfillment',
      icon: <Truck className="w-6 h-6 text-purple-400" />,
      status: 'Connected',
      endpoint: 'api.shiprocket.in/v1/shipments',
      description: 'Automates shipping label creation, generates airway bill numbers (AWB), and tracks parcel dispatches.',
      lastSync: '45m ago'
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">API Integrations</h2>
          <p className="text-slate-400 text-sm mt-0.5">Control remedy ecommerce platforms, CRM synchronizations, and automated dispatches</p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 disabled:from-saffron-500/50 disabled:to-amber-600/50 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-saffron-500/20"
        >
          <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronizing API Pipelines...' : 'Trigger Global Sync'}</span>
        </button>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((plat, index) => (
          <div key={index} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center">
                    {plat.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">{plat.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{plat.endpoint}</p>
                  </div>
                </div>
                
                <span className="flex items-center text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                  {plat.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">{plat.description}</p>
            </div>

            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-slate-500">
              <span className="flex items-center">
                <Link2 className="w-3.5 h-3.5 mr-1" />
                API Key Active
              </span>
              <span>Last sync: {plat.lastSync}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sync Logs Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-saffron-400 animate-pulse" />
            Live Sync Feed (Integration Audit Log)
          </h3>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Updated Real-Time</span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center py-6 text-sm">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/5 font-semibold">
                  <th className="py-2 pb-3">Timestamp</th>
                  <th className="py-2 pb-3">Source Channel</th>
                  <th className="py-2 pb-3">Event Action</th>
                  <th className="py-2 pb-3">Sync Details</th>
                  <th className="py-2 pb-3 text-right">API Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-all">
                    <td className="py-3 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 font-bold text-slate-200">{log.source}</td>
                    <td className="py-3">
                      <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] font-semibold text-saffron-400 uppercase tracking-wide">
                        {log.event}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 leading-normal">{log.details}</td>
                    <td className="py-3 text-right">
                      <span className="text-emerald-400 font-bold flex items-center justify-end">
                        <Check className="w-3.5 h-3.5 mr-0.5" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
