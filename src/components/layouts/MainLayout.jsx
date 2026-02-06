import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  LogOut, 
  Menu, 
  X, 
  User, 
  CreditCard 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Desktop Sidebar Navigation
  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: "Overview", path: "/dashboard" },
    { icon: <TrendingUp size={22} />, label: "Analytics", path: "/analytics" },
    { icon: <Briefcase size={22} />, label: "Divisions", path: "/divisions" },
    { icon: <CreditCard size={22} />, label: "Accounts", path: "/accounts" }, 
  ];

  // Mobile Bottom Dock: Mapping "User" icon to the "/accounts" path
  const mobileDockItems = [
    { icon: <LayoutDashboard size={22} />, path: "/dashboard" },
    { icon: <TrendingUp size={22} />, path: "/analytics" },
    { icon: <Briefcase size={22} />, path: "/divisions" },
  ];

  const handleLogout = () => { 
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Terminate Session?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              localStorage.removeItem('userInfo');
              setUser(null);
              navigate('/login');
              toast.success('DE-AUTHENTICATED');
            }}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-all active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-center',
      style: { background: '#fff', padding: '20px', borderRadius: '1.5rem', border: 'none' },
    });
  };

  return (
    <div className="h-screen w-full bg-[#030712] text-slate-100 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between p-5 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="font-black uppercase tracking-tighter text-lg italic">Spender</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-95 transition-transform"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR (Desktop / Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-[#030712] border-r border-white/5 p-8 
        transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static 
        h-full flex-shrink-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="hidden lg:flex items-center gap-3 mb-12 px-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Wallet size={24} className="text-white" />
              </div>
              <span className="font-black uppercase tracking-tighter text-2xl italic">Spender</span>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${
                    location.pathname === item.path 
                      ? 'bg-white text-black shadow-2xl shadow-white/10' 
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-black text-[10px] text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-[0.2em] border border-transparent hover:border-rose-500/20"
            >
              <LogOut size={18} /> Sign Out Session
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN SCROLLABLE AREA */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
        {children}
        <div className="h-32 lg:hidden"></div> {/* Bottom padding for mobile dock */}
      </main>

      {/* MOBILE BOTTOM DOCK (REFINED) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-50">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2.5 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {mobileDockItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`p-4 rounded-full transition-all active:scale-75 ${
                location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {item.icon}
            </Link>
          ))}
          
          {/* USER ICON -> LINKS DIRECTLY TO ACCOUNTS */}
          <Link 
            to="/accounts" 
            className={`p-4 rounded-full transition-all active:scale-75 ${
              location.pathname === '/accounts' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' 
                : 'text-slate-500'
            }`}
          >
            <CreditCard size={22} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;