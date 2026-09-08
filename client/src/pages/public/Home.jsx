import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Activity, Search, ShieldCheck, Cpu, ArrowRight, Zap, MapPin, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import AIChatWidget from '../../components/ai/AIChatWidget';

const Home = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-lightbg to-[#0b0f19] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>AI-Driven Emergency Blood Matching Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Connecting Lifesaving Donors to Emergency Needs in <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500">Real Time</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            LifeLink combines Haversine proximity scoring, 56-day cooldown rules, blood compatibility matrices, and AI narrative intelligence to save lives when seconds count.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/emergency-request"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base shadow-xl shadow-rose-600/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
              <Activity className="w-5 h-5 animate-pulse" />
              <span>Create Emergency Request</span>
            </Link>

            <Link
              to="/find-donors"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-slate-800 hover:text-white font-bold text-base border border-slate-200 hover:border-rose-500/40 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5 text-rose-400" />
              <span>Find Standby Donors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Loop Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-200 bg-white/80 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">The Closed-Loop Engine</h2>
            <h3 className="text-2xl font-bold text-slate-900">How LifeLink Operates End-to-End</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            {[
              { step: '01', title: 'Emergency Request', desc: 'Hospital or recipient logs urgent blood need with GPS location.' },
              { step: '02', title: 'Smart Matching', desc: 'Rule engine calculates blood compatibility, distance & eligibility.' },
              { step: '03', title: 'Donor Alert', desc: 'Top compatible donors receive immediate push/in-app notifications.' },
              { step: '04', title: 'Donation Pledged', desc: 'Donor accepts request and pledges units at verified medical center.' },
              { step: '05', title: 'Donation Logged', desc: 'Hospital verifies fulfillment and updates regional inventory.' },
              { step: '06', title: 'AI Analytics', desc: 'LLM generates predictive supply insights & mitigation advice.' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-rose-100 block mb-1">{item.step}</span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card title="Rule-Based Matching" icon={Cpu}>
            <p className="text-slate-700 text-xs leading-relaxed">
              Calculates a weighted score combining 2dsphere GeoJSON proximity, recipient compatibility matrix, 56-day cooldown rules, and donor health flags.
            </p>
          </Card>

          <Card title="Dedicated AI Service Layer" icon={Zap}>
            <p className="text-slate-700 text-xs leading-relaxed">
              Aggregates network metrics and queries external LLM APIs (or heuristic fallback) for narrative logistics insights and risk warnings.
            </p>
          </Card>

          <Card title="Role-Based Dashboards" icon={ShieldCheck}>
            <p className="text-slate-700 text-xs leading-relaxed">
              Customized interfaces for Donors (pledges & profile), Recipients (request tracking), Hospitals (inventory), and Admins (insights & user management).
            </p>
          </Card>
        </div>
      </section>

      {/* Floating AI Chat Assistant */}
      <AIChatWidget />
    </div>
  );
};

export default Home;
