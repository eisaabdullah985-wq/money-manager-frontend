import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Mail, ArrowRight, ShieldCheck, Zap, ChevronLeft, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Recovery link dispatched to your vault');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Recovery Initialization Failed');
      }
    } catch (error) {
      toast.error('Connection to Security Server lost');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* LEFT SIDE: Branding (Consistently styled with Login/Register) */}
      <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative bg-[#030712] border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20 group">
            <div className="bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <IndianRupee size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">Spender</span>
          </Link>

          <h1 className="text-6xl font-black text-white leading-tight mb-6 uppercase">
            Access <br />
            <span className="text-indigo-500 italic">Recovery.</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
            Initialize our automated recovery protocol to regain access to your financial infrastructure.
          </p>
        </div>

        <div className="relative z-10 space-y-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
              <KeyRound size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-slate-300">Secure Reset Protocol</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400">
              <ShieldCheck size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-slate-300">Identity Verification</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 transition-colors">
              <ChevronLeft size={14} /> Back to Entry Point
            </Link>

            {!isSubmitted ? (
              <>
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-white uppercase mb-2">Reset Key</h2>
                  <p className="text-slate-500 font-bold text-xs tracking-[0.2em] uppercase">Dispatched via Encrypted Mail</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 ml-1">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input
                        type="email"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                        placeholder="vault@identity.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-indigo-600 hover:text-white transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Dispatching...' : 'Initialize Recovery'} <ArrowRight size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                  <Zap className="text-indigo-400" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase mb-4">Protocol Active</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  Check your communications vault. We've sent a secure link to <span className="text-white font-bold">{email}</span> to reset your access key.
                </p>
                <Link 
                  to="/login"
                  className="inline-block px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  Return to Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;