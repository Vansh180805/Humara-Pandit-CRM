import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api';
import { ShoppingBag, Search, Clipboard, Truck, Check, AlertCircle, IndianRupee, RefreshCw, Award } from 'lucide-react';

const Orders = ({ setCurrentTab, setSelectedClientId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        // Update local state
        setOrders(orders.map(o => o._id === orderId ? res.data : o));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClientClick = (id) => {
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  // Status badges styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Received':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
      case 'Sourced':
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25';
      case 'Lab Certified':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/25';
      case 'Energized':
        return 'bg-gradient-to-r from-saffron-500/20 to-amber-500/20 text-saffron-400 border border-saffron-500/35';
      case 'Shipped':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/25';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
    }
  };

  // Filtering
  const filteredOrders = orders.filter(order => {
    const clientName = order.clientId ? order.clientId.name : 'Unknown';
    const prodName = order.productName || '';
    const certNo = order.certificateNo || '';
    const trackId = order.trackingId || '';
    const matchesSearch = 
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      prodName.toLowerCase().includes(search.toLowerCase()) ||
      certNo.toLowerCase().includes(search.toLowerCase()) ||
      trackId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Remedy Fulfilment & Orders</h2>
          <p className="text-slate-400 text-sm mt-0.5">Manage lab-certifications, pandit blessing, and shipment logistics</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-2 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all"
          title="Refresh Orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400">Total Fulfilment Orders</span>
          <p className="text-xl font-bold text-slate-200 mt-1">{orders.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400">Pending Lab Certifications</span>
          <p className="text-xl font-bold text-purple-400 mt-1">
            {orders.filter(o => o.status === 'Sourced').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400">Blessings Awaiting</span>
          <p className="text-xl font-bold text-saffron-400 mt-1">
            {orders.filter(o => o.status === 'Lab Certified').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400">Total Payout Commissions</span>
          <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center">
            <IndianRupee className="w-4 h-4 mr-0.5" />
            {orders.reduce((acc, curr) => acc + (curr.partnerCommission || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search orders, certificates, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 glass-input text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {['All', 'Order Received', 'Sourced', 'Lab Certified', 'Energized', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-saffron-500 text-white'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Client / Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Fulfilment Stage</th>
                  <th className="px-6 py-4">Trust Certification</th>
                  <th className="px-6 py-4">Shipment Details</th>
                  <th className="px-6 py-4 text-right">Valuation / Comm.</th>
                  <th className="px-6 py-4 no-print text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-white/5 transition-all">
                    {/* Client & Product */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{order.productName}</div>
                      <div 
                        onClick={() => handleClientClick(order.clientId?._id)}
                        className="text-xs text-saffron-400 hover:underline cursor-pointer mt-1 font-medium"
                      >
                        👤 {order.clientId ? order.clientId.name : 'Unknown Client'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 font-medium">
                        {order.category}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Lab Certificate */}
                    <td className="px-6 py-4">
                      {order.certificateNo ? (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-xs font-semibold text-slate-200 flex items-center">
                            <Award className="w-3.5 h-3.5 mr-1 text-purple-400" />
                            {order.certificateNo}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Lab Approved</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Awaiting Certification</span>
                      )}
                    </td>

                    {/* Logistics Tracking */}
                    <td className="px-6 py-4">
                      {order.trackingId ? (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-xs font-semibold text-slate-200 flex items-center">
                            <Truck className="w-3.5 h-3.5 mr-1 text-orange-400" />
                            {order.trackingId}
                          </span>
                          <span className="text-[10px] text-slate-500">Carrier: Shiprocket</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unshipped</span>
                      )}
                    </td>

                    {/* Price & Commission */}
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-200 flex items-center justify-end text-sm">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        {order.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                        Comm: +₹{order.partnerCommission}
                      </div>
                    </td>

                    {/* Actions Dropdown */}
                    <td className="px-6 py-4 no-print text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="bg-cosmic-950 border border-white/10 rounded-lg text-xs font-semibold px-2 py-1.5 text-slate-300 focus:outline-none focus:border-saffron-500"
                      >
                        <option value="Order Received">Order Received</option>
                        <option value="Sourced">Sourced</option>
                        <option value="Lab Certified">Lab Certified</option>
                        <option value="Energized">Energized</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      No remedy orders match current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
