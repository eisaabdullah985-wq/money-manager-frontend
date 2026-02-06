import { useState, useEffect } from 'react';
import { IndianRupee, Briefcase, User, Loader2, PieChart, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Divisions = () => {
  const [divisions, setDivisions] = useState([
    { key: 'personal', name: 'Personal', balance: 0, utilization: 0, icon: <User size={20} />, categories: [] },
    { key: 'office', name: 'Office', balance: 0, utilization: 0, icon: <Briefcase size={20} />, categories: [] }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllDivisionsData();
  }, []);

  const fetchAllDivisionsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo?.token;

      if (!token) throw new Error("Authentication token not found");

      const headers = { 'Authorization': `Bearer ${token}` };

      // Parallel fetching for performance
      const [statsRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transactions/stats?allDivisions=true`, { headers }),
        fetch(`${API_BASE_URL}/api/transactions/category-summary`, { headers })
      ]);

      if (!statsRes.ok || !catRes.ok) throw new Error("Failed to reach financial servers");

      const statsResult = await statsRes.json();
      const catResult = await catRes.json();

      if (statsResult.success && catResult.success) {
        const updatedDivisions = divisions.map(div => {
          // Filter data specific to this division key
          const divData = statsResult.data.filter(item => item._id.division === div.key);
          
          const income = divData
            .filter(item => item._id.type === 'income')
            .reduce((acc, curr) => acc + curr.total, 0);
          
          const expenses = divData
            .filter(item => item._id.type === 'expense')
            .reduce((acc, curr) => acc + curr.total, 0);

          const relevantCats = catResult.data
            ?.filter(cat => cat._id.division === div.key && cat._id.type === 'expense')
            .slice(0, 3);

          return {
            ...div,
            balance: income - expenses,
            utilization: income > 0 ? (expenses / income) * 100 : 0,
            categories: relevantCats || []
          };
        });

        setDivisions(updatedDivisions);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error("Silo sync interrupted");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Synchronizing Ledger</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 lg:p-14 max-w-7xl mx-auto text-slate-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2 text-white">
            Divisions
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={12} className="text-indigo-500" /> Real-time Silo Management
          </p>
        </div>
        
        {error && (
          <button 
            onClick={fetchAllDivisionsData}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all"
          >
            <AlertCircle size={14} /> Re-sync Required
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {divisions.map((silo) => (
          <div key={silo.key} className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                {silo.icon}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Silo Status</p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-emerald-400 text-[10px] font-bold uppercase">Operational</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase italic text-white mb-8 group-hover:translate-x-2 transition-transform duration-500">
              {silo.name} Division
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard 
                label="Net Liquidity" 
                value={silo.balance} 
                isCurrency={true} 
              />
              <StatCard 
                label="Utilization" 
                value={silo.utilization} 
                isCurrency={false} 
                suffix="%" 
                color={silo.utilization > 90 ? "text-rose-400" : "text-indigo-400"}
              />
            </div>

            {/* CATEGORY BREAKDOWN */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <PieChart size={14} className="text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Top Outflows</span>
              </div>
              <div className="space-y-4">
                {silo.categories.length > 0 ? silo.categories.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center group/item">
                    <span className="text-[11px] font-bold uppercase text-slate-400 group-hover/item:text-slate-200 transition-colors">
                      {cat._id.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden hidden md:block">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${(cat.total / (silo.balance + 1)) * 100}%` }} 
                        />
                      </div>
                      <span className="text-xs font-black text-white">₹{cat.total.toLocaleString()}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-4 px-6 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl text-center">
                    <p className="text-[10px] italic text-slate-600 uppercase tracking-widest">Awaiting Transaction Data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GLOBAL AGGREGATE */}
      <div className="bg-indigo-600 border border-indigo-400/30 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex flex-col md:flex-row items-center justify-between overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
           <Activity size={180} />
        </div>
        
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-white text-3xl md:text-4xl font-black uppercase italic leading-tight">
            Global Aggregate
          </h2>
          <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            Combined capital across all active silos
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <IndianRupee size={32} strokeWidth={3} />
          </div>
          <span className="text-5xl md:text-7xl font-black tracking-tighter tabular-nums">
            {divisions.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

// Internal Sub-component for clean mapping
const StatCard = ({ label, value, isCurrency, suffix = "", color = "text-white" }) => (
  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors">
    <p className="text-[8px] font-black uppercase text-slate-500 mb-2 tracking-widest">{label}</p>
    <div className={`flex items-center gap-1 text-xl font-black tracking-tighter italic ${color}`}>
      {isCurrency && <IndianRupee size={14} />} 
      {value.toLocaleString('en-IN', { maximumFractionDigits: 1 })}{suffix}
    </div>
  </div>
);

export default Divisions;