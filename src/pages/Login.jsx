import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IndianRupee, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        toast.success(`Welcome back, ${data.name}`);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Authentication Failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Server Unreachable');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* LEFT SIDE: Content & Branding */}
      <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative bg-[#030712] border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20 group">
            <div className="bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-2 rounded-xl shadow-lg">
              <IndianRupee size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">Spender</span>
          </Link>

          <h1 className="text-6xl font-black text-white leading-tight mb-6 uppercase">
            Welcome <br />
            <span className="text-indigo-500 italic">Back.</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
            Enter your credentials to access your unified financial dashboard and manage your assets.
          </p>
        </div>

        <div className="relative z-10 space-y-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-slate-300">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400">
              <Zap size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-slate-300">Real-time Synchronization</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/5 blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white uppercase mb-2">Login</h2>
              <p className="text-slate-500 font-bold text-xs tracking-[0.2em] uppercase">Security Portal Access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 ml-1">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    placeholder="name@finance.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 ml-1">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pr-1">
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-indigo-600 hover:text-white transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-2"
              >
                Authenticate <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-tighter">
                New User ? {' '}
                <Link to="/register" className="text-white hover:text-indigo-400 underline underline-offset-8 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;