import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IndianRupee, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Client-side validation
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Security Keys do not match');
    }

    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      // 2. Real API Call to your Backend
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Success Logic: Save the real user/token from MongoDB
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        toast.success('Account Created Successfully');
        navigate('/dashboard');
      } else {
        // 4. Handle Unique Email Conflict (error 400/409 from server)
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Cannot connect to authentication server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row font-sans overflow-hidden text-slate-100">
      
      {/* LEFT SIDE: Branding & Value Prop */}
      <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative bg-[#030712] border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20 group">
            <div className="bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-2 rounded-xl shadow-lg">
              <IndianRupee size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">Spender</span>
          </Link>

          <h1 className="text-6xl font-black leading-tight mb-6 uppercase">
            Start Your <br />
            <span className="text-indigo-500 italic">Journey.</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
            Join the elite ecosystem for unified personal and corporate financial management.
          </p>
        </div>

        <div className="relative z-10 space-y-6 mb-10">
          {[
            { icon: <ShieldCheck size={20} />, text: "Encrypted Data Vault", color: "text-indigo-400" },
            { icon: <Zap size={20} />, text: "Instant Synchronization", color: "text-fuchsia-400" },
            { icon: <BarChart3 size={20} />, text: "Advanced Division Analytics", color: "text-emerald-400" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors">
                <span className={item.color}>{item.icon}</span>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="w-full max-w-md relative z-10 py-12">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white uppercase mb-2">Register</h2>
              <p className="text-slate-500 font-bold text-xs tracking-[0.2em] uppercase">Initialize Security Profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 ml-1">Legal Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 ml-1">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    placeholder="name@finance.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 ml-1">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
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

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 ml-1">Confirm Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-indigo-600 hover:text-white transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-tighter">
                Already registered?{' '}
                <Link to="/login" className="text-white hover:text-indigo-400 underline underline-offset-8 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;