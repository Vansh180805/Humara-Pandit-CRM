import React, { useState, useEffect } from 'react';
import { getClientById, createConsultation } from '../../services/api';
import { Calendar, Phone, MapPin, ArrowLeft, PlusCircle, Sparkles, Clock, CheckCircle } from 'lucide-react';

const ClientProfile = ({ clientId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for adding new consultation inside profile
  const [notes, setNotes] = useState('');
  const [selectedGemstones, setSelectedGemstones] = useState([]);
  const [selectedRudrakshas, setSelectedRudrakshas] = useState([]);
  const [selectedCrystals, setSelectedCrystals] = useState([]);
  const [followUpDate, setFollowUpDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Remedy choices
  const gemstonesList = ['Yellow Sapphire', 'Blue Sapphire', 'Ruby', 'Pearl', 'Emerald', 'Red Coral'];
  const rudrakshasList = ['2 Mukhi Rudraksha', '5-Mukhi Rudraksha Mala', '8 Mukhi Rudraksha'];
  const crystalsList = ['Amethyst Crystal', 'Clear Quartz', 'Rose Quartz'];

  useEffect(() => {
    fetchProfile();
  }, [clientId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getClientById(clientId);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load client details.');
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

  const handleSubmitConsultation = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert('Please add consultation notes.');
      return;
    }

    try {
      setSaving(true);
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
        setNotes('');
        setSelectedGemstones([]);
        setSelectedRudrakshas([]);
        setSelectedCrystals([]);
        setFollowUpDate('');
        
        // Refresh Timeline
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log consultation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-6 text-center text-red-400">
        <p>{error || 'Client details not found'}</p>
        <button onClick={onBack} className="mt-4 bg-saffron-500 text-white px-4 py-2 rounded-lg text-xs font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const { client, history } = data;

  // Aggregate all recommended remedies across all past consultations
  const allGemstones = [...new Set(history.flatMap(h => h.remedies?.gemstones || []))];
  const allRudrakshas = [...new Set(history.flatMap(h => h.remedies?.rudrakshas || []))];
  const allCrystals = [...new Set(history.flatMap(h => h.remedies?.crystals || []))];

  // List of active follow-ups
  const followUpsList = history
    .filter(h => h.followUpDate)
    .map(h => ({
      date: h.followUpDate,
      status: h.followUpStatus,
      consultationId: h._id
    }));

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between no-print">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 dark:text-slate-405 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
        
        <span className="text-xs text-saffron-650 dark:text-saffron-400 font-bold bg-saffron-500/10 px-3 py-1 rounded border border-saffron-500/20 uppercase tracking-wider">
          Client Profile
        </span>
      </div>

      {/* Grid: Personal Info & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Personal Info Card */}
        <div className="glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-saffron-600 dark:text-saffron-400 bg-saffron-500/10 px-2 py-0.5 rounded border border-saffron-500/20 font-bold uppercase tracking-wider">Personal Info</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">{client.name}</h3>
              <p className="text-xs text-saffron-600 dark:text-saffron-400 mt-1 font-bold">🔮 Horoscope: {client.rashi}</p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-slate-100">{client.phone}</span>
              </div>
              {client.email && (
                <div className="flex items-center space-x-3 overflow-hidden text-ellipsis">
                  <span className="text-slate-400 font-bold text-xs">@</span>
                  <span className="truncate font-semibold">{client.email}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {new Date(client.dob).toLocaleDateString('en-IN', { dateStyle: 'medium' })} at {client.tob}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{client.pob}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-400">Gender:</span>
                <span>{client.gender || 'Male'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-[10px] text-slate-400">
            Registered on {new Date(client.createdAt).toLocaleDateString('en-IN')}
          </div>
        </div>

        {/* 2. Recommended Remedies aggregated */}
        <div className="glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
            <Sparkles className="w-4.5 h-4.5 mr-2 text-saffron-500 dark:text-saffron-400" />
            Recommended Remedies Summary
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[200px]">
            {/* Gemstones */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Gemstones</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {allGemstones.map(gem => (
                  <span key={gem} className="bg-amber-500/10 text-amber-700 dark:text-amber-405 border border-amber-500/20 dark:border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">💎 {gem}</span>
                ))}
                {allGemstones.length === 0 && <span className="text-xs text-slate-500 italic">None recommended yet</span>}
              </div>
            </div>

            {/* Rudrakshas */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Rudrakshas</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {allRudrakshas.map(rud => (
                  <span key={rud} className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 dark:border-orange-500/30 px-2 py-0.5 rounded text-[10px] font-bold">📿 {rud}</span>
                ))}
                {allRudrakshas.length === 0 && <span className="text-xs text-slate-500 italic">None recommended yet</span>}
              </div>
            </div>

            {/* Crystals */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Crystals</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {allCrystals.map(cry => (
                  <span key={cry} className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold">🔮 {cry}</span>
                ))}
                {allCrystals.length === 0 && <span className="text-xs text-slate-505 italic">None recommended yet</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Follow-Up Status */}
        <div className="glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
            <Clock className="w-4.5 h-4.5 mr-2 text-rose-500" />
            Follow-Up Trackings
          </h3>

          <div className="space-y-2.5 overflow-y-auto max-h-[200px]">
            {followUpsList.map((f, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/50 p-3 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-705 dark:text-slate-200 font-bold">
                  📅 {new Date(f.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  f.status === 'Completed' ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                }`}>
                  {f.status}
                </span>
              </div>
            ))}
            {followUpsList.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-6">No follow-ups logged for this client</p>
            )}
          </div>
        </div>
      </div>

      {/* Timeline and logging form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Consultation History */}
        <div className="lg:col-span-2 glass-panel p-5 border border-slate-200 dark:border-slate-800 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4">Consultation Notes Log</h3>
          
          <div className="flex-1 space-y-6 mt-6 overflow-y-auto max-h-[500px] pr-2">
            {history.map((session) => (
              <div key={session._id} className="relative flex items-start space-x-4 pl-4 border-l border-slate-200 dark:border-slate-800 pb-6 last:pb-0">
                <div className="absolute w-2.5 h-2.5 bg-saffron-500 rounded-full -left-[5.5px] top-2 ring-4 ring-slate-50 dark:ring-slate-900"></div>
                
                <div className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg space-y-3 shadow-sm dark:shadow-none">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>
                      {new Date(session.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-normal">{session.notes}</p>

                  {/* Remedies */}
                  {((session.remedies?.gemstones && session.remedies.gemstones.length > 0) || 
                    (session.remedies?.rudrakshas && session.remedies.rudrakshas.length > 0) ||
                    (session.remedies?.crystals && session.remedies.crystals.length > 0)) && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 flex flex-wrap gap-2 text-[10px] font-semibold">
                      {session.remedies.gemstones.map(g => (
                        <span key={g} className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 px-2 py-0.5 rounded font-semibold">💎 {g}</span>
                      ))}
                      {session.remedies.rudrakshas.map(r => (
                        <span key={r} className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 dark:border-orange-500/30 px-2 py-0.5 rounded font-semibold">📿 {r}</span>
                      ))}
                      {session.remedies.crystals.map(c => (
                        <span key={c} className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 px-2 py-0.5 rounded font-semibold">🔮 {c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs italic">No consultation logs recorded.</div>
            )}
          </div>
        </div>

        {/* Quick Log Form inside profile */}
        <div className="glass-panel p-5 border border-slate-200 dark:border-slate-800 space-y-6 h-fit no-print">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <PlusCircle className="w-4.5 h-4.5 mr-2 text-saffron-500 dark:text-saffron-400" />
            Quick Session Logger
          </h3>

          <form onSubmit={handleSubmitConsultation} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Observations *</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Horoscope observations, placement issues..."
                required
                className="w-full px-3 py-2 glass-input text-xs resize-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="font-bold text-slate-705 dark:text-slate-350 block flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-saffron-500 dark:text-saffron-400" />
                Remedy Recommendations
              </span>

              {/* Gemstones */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Gemstones</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {gemstonesList.map(gem => (
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
                  {rudrakshasList.map(rud => (
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
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Crystals</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {crystalsList.map(cry => (
                    <label key={cry} className="flex items-center space-x-1.5 cursor-pointer bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedCrystals.includes(cry)}
                        onChange={() => handleCrystalToggle(cry)}
                        className="rounded border-slate-300 dark:border-slate-700 text-saffron-500 bg-white dark:bg-slate-900 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">{cry}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Follow-Up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-2 py-1.5 glass-input text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:bg-saffron-500/50 text-white font-bold py-2 rounded-lg text-xs transition-all font-semibold"
            >
              {saving ? 'Logging...' : 'Save Notes & Log Remedies'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
