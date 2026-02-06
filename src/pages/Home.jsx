import { Link } from 'react-router-dom';
import { IndianRupee, ArrowRight, ShieldCheck, Zap, BarChart3, Sparkles, Plus } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Background Glows - Using standard opacity and blurs */}
      <div className="fixed top-0 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[120px]"></div>
      <div className="fixed -bottom-20 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[120px]"></div>

      {/* Nav - Professional Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#030712]/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <IndianRupee size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">
              Spender
            </span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            <Link to="/login" className="text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-10">
          <Sparkles size={14} /> Intelligent Financial Management
        </div>
        
        <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none mb-10 uppercase">
          Master Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400">
            Capital.
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          The next-generation expense ecosystem. Seamlessly manage <span className="text-white italic font-semibold">corporate disbursements</span> and <span className="text-white italic font-semibold">personal assets</span> in one unified interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/register" className="group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-slate-200 transition-all active:scale-95 shadow-xl">
            CREATE ACCOUNT <Plus size={24} />
          </Link>
          <div className="text-slate-500 font-bold text-sm tracking-widest uppercase border-l border-slate-800 pl-6">
            Secure • Real-time • Unified
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Feature - Analytics */}
          <div className="md:col-span-8 group p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-800 border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 text-left">
              <Zap size={48} className="text-white mb-6" />
              <h3 className="text-4xl font-black mb-4 uppercase italic">Advanced Analytics</h3>
              <p className="text-indigo-100 text-xl max-w-md leading-relaxed font-medium">
                High-fidelity data visualization. Monitor cash flow velocity and burn rates with enterprise-grade precision.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          </div>

          {/* Security Box */}
          <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-slate-900/50 border border-white/10 backdrop-blur-3xl hover:border-indigo-500/50 transition-all text-left">
            <ShieldCheck size={40} className="text-indigo-400 mb-6" />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Encrypted Security</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Bank-level encryption protocols ensuring your financial data remains private and compliant.
            </p>
          </div>

          {/* Work/Life Balance Box */}
          <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-slate-900/50 border border-white/10 backdrop-blur-3xl hover:border-fuchsia-500/50 transition-all text-left">
            <BarChart3 size={40} className="text-fuchsia-400 mb-6" />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Dual-Engine Tracking</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Toggle between Office and Personal accounting engines to eliminate cross-contamination of funds.
            </p>
          </div>

          {/* Bottom CTA Box */}
          <div className="md:col-span-8 p-10 rounded-[2.5rem] bg-white text-black flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h3 className="text-4xl font-black uppercase italic leading-none">Ready for <br /> clarity?</h3>
            </div>
            <Link to="/register" className="w-full md:w-auto px-12 py-6 bg-black text-white rounded-3xl font-black text-center hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
              GET STARTED NOW <ArrowRight size={20} />
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-600 text-[10px] font-bold tracking-[0.4em] uppercase">
        &copy; 2026 Spender Financial Systems // The Standard for Personal Finance
      </footer>
    </div>
  );
};

export default Home;