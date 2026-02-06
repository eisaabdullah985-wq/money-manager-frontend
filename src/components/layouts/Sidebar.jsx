import { LayoutDashboard, Receipt, IndianRupee, Wallet, PieChart, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast'; // Import toast

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // New Logout Confirmation Function
  const handleLogoutConfirm = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-slate-800">
          Are you sure you want to log out?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logout();
              toast.success('Logged out successfully');
            }}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-all active:scale-95"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-left',
      style: {
        background: '#fff',
        padding: '16px',
        borderRadius: '1.25rem',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
    });
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Accounts', path: '/accounts' },
    { icon: PieChart, label: 'Reports', path: '/reports' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
        <div className="bg-indigo-500 p-1.5 rounded-lg">
          <IndianRupee size={24} />
        </div>
        <span>Spender</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogoutConfirm} // Update to call the confirm function
        className="p-4 m-4 flex items-center gap-3 text-slate-400 hover:text-rose-400 border-t border-slate-800 transition-colors group"
      >
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;