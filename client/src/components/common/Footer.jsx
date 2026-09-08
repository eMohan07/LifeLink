import React from 'react';
import { HeartHandshake, ShieldCheck, Activity, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#070a12] border-t border-slate-800/80 pt-12 pb-8 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">LifeLink</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart blood donation & emergency donor matching engine powered by AI narrative intelligence and location-based proximity scoring.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/find-donors" className="hover:text-rose-400 transition-colors">Find Donors</a></li>
              <li><a href="/emergency-request" className="hover:text-rose-400 transition-colors">Emergency Request</a></li>
              <li><a href="/about" className="hover:text-rose-400 transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Roles & Access</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/login" className="hover:text-rose-400 transition-colors">Donor Portal</a></li>
              <li><a href="/login" className="hover:text-rose-400 transition-colors">Recipient Hub</a></li>
              <li><a href="/login" className="hover:text-rose-400 transition-colors">Hospital Verification</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Emergency Hotline</h4>
            <p className="text-rose-400 font-bold text-lg">1800-LIFELINK</p>
            <p className="text-xs text-slate-500 mt-1">24/7 Priority Emergency Dispatcher System</p>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LifeLink Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="flex items-center text-emerald-400"><Activity className="w-3.5 h-3.5 mr-1" /> API Gateway Operational</span>
            <span className="flex items-center text-slate-400"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-400" /> HIPAA / GeoJSON Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
