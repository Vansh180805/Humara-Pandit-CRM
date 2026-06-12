const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get headers with JWT token
const getHeaders = (includeContentType = false) => {
  const token = localStorage.getItem('hp_token');
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const getClients = async (search = '') => {
  const res = await fetch(`${API_BASE}/clients?search=${encodeURIComponent(search)}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
};

export const getClientById = async (id) => {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch client details');
  return res.json();
};

export const createClient = async (clientData) => {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(clientData),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to create client');
  }
  return res.json();
};

export const updateClient = async (id, clientData) => {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(clientData),
  });
  if (!res.ok) throw new Error('Failed to update client');
  return res.json();
};

export const deleteClient = async (id) => {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete client');
  return res.json();
};

// Appointments
export const getAppointments = async () => {
  const res = await fetch(`${API_BASE}/appointments`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
};

export const createAppointment = async (appointmentData) => {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(appointmentData),
  });
  if (!res.ok) throw new Error('Failed to create appointment');
  return res.json();
};

// Consultations
export const getConsultations = async (clientId = '') => {
  const url = clientId ? `${API_BASE}/consultations?clientId=${clientId}` : `${API_BASE}/consultations`;
  const res = await fetch(url, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch consultations');
  return res.json();
};

export const createConsultation = async (consultationData) => {
  const res = await fetch(`${API_BASE}/consultations`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(consultationData),
  });
  if (!res.ok) throw new Error('Failed to save consultation');
  return res.json();
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
};

// Auth
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Invalid credentials');
  }
  return res.json();
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Registration failed');
  }
  return res.json();
};
