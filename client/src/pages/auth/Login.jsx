import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HeartHandshake, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import Card from '../../components/common/Card';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        // Redirect to appropriate dashboard if no explicit query redirect
        if (redirect === '/') {
          switch (user.role) {
            case 'donor':
              navigate('/donor/dashboard');
              break;
            case 'recipient':
              navigate('/recipient/dashboard');
              break;
            case 'hospital':
              navigate('/hospital/dashboard');
              break;
            case 'admin':
              navigate('/admin/dashboard');
              break;
            default:
              navigate('/');
          }
        } else {
          navigate(redirect);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo account loader helper
  const loadDemoUser = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Sign In to LifeLink</h1>
        <p className="text-xs text-slate-400">Access role-based donor, recipient, hospital & admin portals</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
          {error}
        </div>
      )}

      <Card hover={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. donor1@lifelink.com"
              className="w-full bg-slate-900 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Login Quick Selection */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            One-Click Demo Account Quick Fill
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => loadDemoUser('donor1@lifelink.com', 'donor123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-rose-400 text-left"
            >
              <span className="font-bold block">Donor Account</span>
              <span className="text-[10px] text-slate-500">O- Universal Donor</span>
            </button>
            <button
              type="button"
              onClick={() => loadDemoUser('recipient@lifelink.com', 'recipient123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-indigo-400 text-left"
            >
              <span className="font-bold block">Recipient Account</span>
              <span className="text-[10px] text-slate-500">Create Emergency Needs</span>
            </button>
            <button
              type="button"
              onClick={() => loadDemoUser('hospital@lifelink.com', 'hospital123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sky-400 text-left"
            >
              <span className="font-bold block">Hospital Account</span>
              <span className="text-[10px] text-slate-500">Manage Inventory</span>
            </button>
            <button
              type="button"
              onClick={() => loadDemoUser('admin@lifelink.com', 'admin123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-amber-400 text-left"
            >
              <span className="font-bold block">Admin Account</span>
              <span className="text-[10px] text-slate-500">AI Insights & Control</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-rose-400 font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
