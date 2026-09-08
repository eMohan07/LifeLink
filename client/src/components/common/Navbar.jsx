import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HeartHandshake, 
  Activity, 
  User, 
  LogOut, 
  PlusCircle, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  Search
} from 'lucide-react';
import Badge from './Badge';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-rose-400">
                Life<span className="text-rose-500">Link</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Smart Donor Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-rose-400 ${
                isActive('/') ? 'text-rose-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/find-donors"
              className={`text-sm font-medium transition-colors hover:text-rose-400 flex items-center space-x-1 ${
                isActive('/find-donors') ? 'text-rose-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Search className="w-4 h-4 mr-1" />
              Find Donors
            </Link>
            <Link
              to="/emergency-request"
              className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center shadow-sm"
            >
              <Activity className="w-4 h-4 mr-1 animate-pulse" />
              Emergency Request
            </Link>

            {/* Role-Specific Portal Links */}
            {user && (
              <>
                {role === 'donor' && (
                  <Link
                    to="/donor/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-rose-400 ${
                      isActive('/donor/dashboard') ? 'text-rose-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    Donor Hub
                  </Link>
                )}
                {role === 'recipient' && (
                  <Link
                    to="/recipient/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-rose-400 ${
                      isActive('/recipient/dashboard') ? 'text-rose-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    Recipient Dashboard
                  </Link>
                )}
                {role === 'hospital' && (
                  <Link
                    to="/hospital/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-rose-400 flex items-center ${
                      isActive('/hospital/dashboard') ? 'text-rose-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mr-1 text-sky-400" />
                    Hospital Portal
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-amber-400 flex items-center ${
                      isActive('/admin/dashboard') ? 'text-amber-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mr-1 text-amber-400" />
                    Admin Command
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-rose-900/40 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</div>
                  <Badge role={user.role} />
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 px-4 py-2 rounded-xl shadow-lg shadow-rose-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2"
          >
            Home
          </Link>
          <Link
            to="/find-donors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2"
          >
            Find Donors
          </Link>
          <Link
            to="/emergency-request"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-rose-400 font-semibold py-2"
          >
            Emergency Request
          </Link>
          {user ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-sm font-semibold text-slate-200">{user.name} ({user.role})</div>
              {role === 'donor' && <Link to="/donor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 py-1">Donor Dashboard</Link>}
              {role === 'recipient' && <Link to="/recipient/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 py-1">Recipient Dashboard</Link>}
              {role === 'hospital' && <Link to="/hospital/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 py-1">Hospital Dashboard</Link>}
              {role === 'admin' && <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-amber-400 py-1">Admin Panel</Link>}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-rose-400 font-medium py-2 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-slate-200 bg-slate-800 rounded-lg">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-white bg-rose-600 rounded-lg font-semibold">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
