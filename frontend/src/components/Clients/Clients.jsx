import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../../services/api';
import { Search, UserPlus, Phone, Calendar, MapPin, X, Trash2, Edit2, AlertCircle } from 'lucide-react';

const Clients = ({ setCurrentTab, setSelectedClientId }) => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    tob: '',
    pob: '',
    gender: 'Male'
  });

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients(search);
      if (data.success) {
        setClients(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load clients. Verify database connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      dob: '',
      tob: '',
      pob: '',
      gender: 'Male'
    });
    setModalOpen(true);
  };

  const openEditModal = (client, e) => {
    e.stopPropagation();
    setEditingId(client._id);
    
    const formattedDob = client.dob ? new Date(client.dob).toISOString().split('T')[0] : '';
    
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      dob: formattedDob,
      tob: client.tob || '',
      pob: client.pob || '',
      gender: client.gender || 'Male'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingId) {
        const res = await updateClient(editingId, formData);
        if (res.success) {
          setModalOpen(false);
          fetchClients();
        }
      } else {
        const res = await createClient(formData);
        if (res.success) {
          setModalOpen(false);
          fetchClients();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error saving client. Ensure all required fields are set.');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this client? This cannot be undone.')) {
      try {
        const res = await deleteClient(id);
        if (res.success) {
          fetchClients();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete client');
      }
    }
  };

  const handleSelectClient = (id) => {
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full transition-colors duration-200">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Client Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Manage Astro-profile database, birth details, and Rashis</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-4 py-2 rounded-lg transition-all text-xs tracking-wide shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass-input text-xs font-semibold"
          />
        </div>
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Rashi</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">DOB & TOB</th>
                  <th className="py-3 px-4">Place of Birth</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {clients.map((client) => (
                  <tr 
                    key={client._id}
                    onClick={() => handleSelectClient(client._id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {client.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-saffron-50 dark:bg-saffron-950/30 text-saffron-600 dark:text-saffron-400 border border-saffron-100 dark:border-saffron-900/30">
                        🔮 {client.rashi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                      {client.email && (
                        <div className="text-[10px] text-slate-400 lowercase">{client.email}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        {new Date(client.dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400">at {client.tob}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {client.pob}
                    </td>
                    <td className="py-3.5 px-4 text-right no-print" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleSelectClient(client._id)}
                          className="px-2 py-1 text-[10px] font-bold text-saffron-600 dark:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-950/30 rounded border border-saffron-100 dark:border-saffron-900/30 transition-all"
                        >
                          Consult
                        </button>
                        <button
                          onClick={(e) => openEditModal(client, e)}
                          className="p-1 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(client._id, e)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-950/30"
                          title="Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400 dark:text-slate-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      No clients found in directory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xl relative animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {editingId ? 'Edit Client Details' : 'Register New Client'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Vansh Kaushik"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. vansh@gmail.com"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Time of Birth *</label>
                  <input
                    type="text"
                    name="tob"
                    required
                    value={formData.tob}
                    onChange={handleInputChange}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Place of Birth *</label>
                  <input
                    type="text"
                    name="pob"
                    required
                    value={formData.pob}
                    onChange={handleInputChange}
                    placeholder="e.g. Delhi"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 glass-input text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-705 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-lg transition-all"
                >
                  {editingId ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
