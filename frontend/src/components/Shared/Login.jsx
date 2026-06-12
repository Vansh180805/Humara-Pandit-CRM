import React, { useState } from 'react';
import { login, registerUser } from '../../services/api';
import { Sparkles, AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        const res = await registerUser(name, email, password);
        if (res.success) {
          onLoginSuccess(res.data);
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          onLoginSuccess(res.data);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@demo.com');
      setPassword('Admin@123');
    } else {
      setEmail('astrologer@demo.com');
      setPassword('Astro@123');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-8 space-y-6 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-saffron-500 flex items-center justify-center shadow-sm mx-auto">
            <span className="text-xl">🔮</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              HUMARA PANDIT
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-extrabold mt-1">Remedy OMS & CRM Portal</p>
          </div>
        </div>

        {/* Demo Accounts Panel */}
        {!isRegister && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-555 dark:text-slate-400 tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-saffron-500" />
              Quick Demo Logins (Click to Autofill)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold transition-all text-center"
              >
                🔐 Login as Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('astrologer')}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold transition-all text-center"
              >
                🔮 Login as Astrologer
              </button>
            </div>
          </div>
        )}

        {/* Error Box */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-450 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pandit Shastri"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-455 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email address"
                className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-455 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter password"
                className="w-full pl-10 pr-10 py-2.5 glass-input text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-all"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:bg-saffron-500/50 text-white font-bold py-2.5 rounded-md text-xs transition-all shadow-sm"
          >
            {loading ? 'Processing...' : isRegister ? 'Register & Log In' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-xs text-saffron-600 dark:text-saffron-400 hover:underline font-semibold"
          >
            {isRegister 
              ? 'Already registered? Sign In instead' 
              : 'Need access? Sign Up as Astrologer'}
          </button>
        </div>

        <div className="text-center text-[9px] text-slate-400 dark:text-slate-600">
          &copy; {new Date().getFullYear()} Humara Pandit. Certified Remedy fulfillment Center.
        </div>
      </div>
    </div>
  );
};

export default Login;
