import React, { useState, useEffect } from 'react';
import { getConsultations, createConsultation, getClients } from '../../services/api';
import { Clipboard, User, Calendar, Sparkles, AlertCircle, Plus, Clock } from 'lucide-react';

const Consultations = ({ setCurrentTab, setSelectedClientId }) => {
  const [consultations, setConsultations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedGemstones, setSelectedGemstones] = useState([]);
  const [selectedRudrakshas, setSelectedRudrakshas] = useState([]);
  const [selectedCrystals, setSelectedCrystals] = useState([]);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState('None');
  const [adding, setAdding] = useState(false);

  // Remedy lists
  const gemstones = ['Yellow Sapphire', 'Blue Sapphire', 'Ruby', 'Pearl', 'Emerald', 'Red Coral'];
  const rudrakshas = ['2 Mukhi Rudraksha', '5-Mukhi Rudraksha Mala', '8 Mukhi Rudraksha'];
  const crystals = ['Amethyst Crystal', 'Clear Quartz', 'Rose Quartz'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const consRes = await getConsultations();
      const clientRes = await getClients();
      
      if (consRes.success) setConsultations(consRes.data);
      if (clientRes.success) setClients(clientRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load consultations. Verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGemstoneToggle = (gem) => {
    if (selectedGemstones.includes(gem)) {
      setSelectedGemstones(selectedGemstones.filter(g => g !== gem));
    } else {
      setSelectedGemstones([...selectedGemstones, gem]);
    }
  };

  const handleRudrakshaToggle = (rud) => {
    if (selectedRudrakshas.includes(rud)) {
      setSelectedRudrakshas(selectedRudrakshas.filter(r => r !== rud));
    } else {
      setSelectedRudrakshas([...selectedRudrakshas, rud]);
    }
  };

  const handleCrystalToggle = (crys) => {
    if (selectedCrystals.includes(crys)) {
      setSelectedCrystals(selectedCrystals.filter(c => c !== crys));
    } else {
      setSelectedCrystals([...selectedCrystals, crys]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !notes.trim()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setAdding(true);
      const payload = {
        clientId,
        notes,
        remedies: {
          gemstones: selectedGemstones,
          rudrakshas: selectedRudrakshas,
          crystals: selectedCrystals
        },
        followUpDate: followUpDate || null,
        followUpStatus: followUpDate ? 'Pending' : 'None'
      };

      const res = await createConsultation(payload);
      if (res.success) {
        // Reset
        setClientId('');
        setNotes('');
        setSelectedGemstones([]);
        setSelectedRudrakshas([]);
        setSelectedCrystals([]);
        setFollowUpDate('');
        setFollowUpStatus('None');
        
        // Refresh
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log consultation');
    } finally {
      setAdding(false);
    }
  };

  const handleClientClick = (id) => {
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Consultation Manager</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Record consultation notes, recommend remedies, and log follow-up tasks</p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-705 dark:text-red-200 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 dark:text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Log Form */}
        <div className="glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-4 h-fit max-h-[90vh] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Plus className="w-4 h-4 mr-1.5 text-saffron-500 dark:text-saffron-400" />
            Log Consultation Session
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
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Discussion Notes *</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Horoscope observations, placement issues, concerns..."
                required
                className="w-full px-3 py-2 glass-input text-xs resize-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Remedies Checklist */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-slate-700 dark:text-slate-350 block flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-saffron-500 dark:text-saffron-400" />
                Recommend Remedies
              </span>

              {/* Gemstones */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Gemstones</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {gemstones.map(gem => (
                    <label key={gem} className="flex items-center space-x-1.5 cursor-pointer bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedGemstones.includes(gem)}
                        onChange={() => handleGemstoneToggle(gem)}
                        className="rounded border-slate-300 dark:border-slate-700 text-saffron-500 bg-white dark:bg-slate-900 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{gem}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rudrakshas */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Rudrakshas</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {rudrakshas.map(rud => (
                    <label key={rud} className="flex items-center space-x-1.5 cursor-pointer bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedRudrakshas.includes(rud)}
                        onChange={() => handleRudrakshaToggle(rud)}
                        className="rounded border-slate-300 dark:border-slate-700 text-saffron-500 bg-white dark:bg-slate-900 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{rud}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Crystals */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-405 dark:text-slate-400 tracking-wider">Crystals</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {crystals.map(crys => (
                    <label key={crys} className="flex items-center space-x-1.5 cursor-pointer bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedCrystals.includes(crys)}
                        onChange={() => handleCrystalToggle(crys)}
                        className="rounded border-slate-300 dark:border-slate-700 text-saffron-500 bg-white dark:bg-slate-900 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{crys}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow Up */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Follow-Up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-2 py-1.5 glass-input text-xs bg-white dark:bg-slate-900 text-slate-805 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Follow-Up Status</label>
                <input
                  type="text"
                  disabled
                  value={followUpDate ? 'Pending' : 'None'}
                  className="w-full px-2 py-1.5 glass-input text-xs bg-slate-105 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:bg-saffron-500/50 text-white font-bold py-2 rounded-lg text-xs transition-all font-semibold"
            >
              {adding ? 'Logging...' : 'Save Consultation Record'}
            </button>
          </form>
        </div>

        {/* Consultations List Directory */}
        <div className="lg:col-span-2 glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Consultation Session History</h3>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 font-medium">
              {consultations.map(cons => (
                <div key={cons._id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg space-y-2 shadow-sm dark:shadow-none">
                  <div className="flex items-center justify-between">
                    <span 
                      onClick={() => handleClientClick(cons.clientId?._id)}
                      className="font-bold text-saffron-600 dark:text-saffron-400 hover:underline cursor-pointer"
                    >
                      👤 {cons.clientId ? cons.clientId.name : 'Deleted Client'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(cons.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-205 leading-relaxed whitespace-pre-line font-normal">{cons.notes}</p>

                  {/* Remedies */}
                  {((cons.remedies.gemstones && cons.remedies.gemstones.length > 0) ||
                    (cons.remedies.rudrakshas && cons.remedies.rudrakshas.length > 0) ||
                    (cons.remedies.crystals && cons.remedies.crystals.length > 0)) && (
                    <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                      {cons.remedies.gemstones.map(g => (
                        <span key={g} className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 px-2 py-0.5 rounded font-semibold">💎 {g}</span>
                      ))}
                      {cons.remedies.rudrakshas.map(r => (
                        <span key={r} className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 dark:border-orange-500/30 px-2 py-0.5 rounded font-semibold">📿 {r}</span>
                      ))}
                      {cons.remedies.crystals.map(c => (
                        <span key={c} className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 px-2 py-0.5 rounded font-semibold">🔮 {c}</span>
                      ))}
                    </div>
                  )}

                  {/* Follow Up status display */}
                  {cons.followUpDate && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Follow-Up: {new Date(cons.followUpDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cons.followUpStatus === 'Completed' ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400'
                      }`}>
                        {cons.followUpStatus}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {consultations.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No consultation history recorded yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultations;
