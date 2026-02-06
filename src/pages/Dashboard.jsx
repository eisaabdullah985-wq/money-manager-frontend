import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, Plus, Loader2, IndianRupee, 
  Pencil, Trash2, Filter, Calendar, Zap, LayoutGrid 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AddTransactionModal from '../components/modals/AddTransactionModal';

const Dashboard = () => {
  const [activeDivision, setActiveDivision] = useState('Personal');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'income', 'expense'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 5;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ balance: 0, income: 0, expenses: 0 });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'all',
    view: 'monthly'
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      const queryParams = new URLSearchParams({
        division: activeDivision.toLowerCase(),
        category: filters.category !== 'all' ? filters.category : '',
        startDate: filters.startDate,
        endDate: filters.endDate,
        type: activeTab === 'all' ? '' : activeTab, // Filter by type
        page: currentPage,
        limit: recordsPerPage
      });

      const [txRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transactions?${queryParams}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/transactions/stats?timeframe=${filters.view}&division=${activeDivision.toLowerCase()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const txData = await txRes.json();
      const statsData = await statsRes.json();

      if (txData.success) {
        setTransactions(txData.transactions);
        setTotalRecords(txData.total);
      }

      if (statsData.success) {
        const income = statsData.data
          .filter(s => s._id.type === 'income')
          .reduce((acc, curr) => acc + curr.total, 0);
        const expenses = statsData.data
          .filter(s => s._id.type === 'expense')
          .reduce((acc, curr) => acc + curr.total, 0);

        setStats({ income, expenses, balance: income - expenses });
      }
    } catch (error) {
      toast.error("Cloud Link Interrupted");
    } finally {
      setLoading(false);
    }
  }, [activeDivision, filters, activeTab, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeDivision, filters.category]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- DELETE LOGIC ---
  const confirmDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-white">Purge entry from ledger?</p>
        <div className="flex gap-2">
          <button
            onClick={() => { toast.dismiss(t.id); executeDelete(id); }}
            className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/10 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'bottom-center',
      style: { background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' }
    });
  };

  const executeDelete = async (id) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${userInfo?.token}`,
          'Content-Type': 'application/json' 
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Record Purged");
        fetchDashboardData(); 
      } else {
        toast.error(data.error || "Purge Rejected");
      }
    } catch (error) {
      toast.error("Network Link Severed");
    }
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-10 lg:p-14 max-w-7xl mx-auto space-y-10">
      
      {/* 1. HEADER & SILO TOGGLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Dashboard</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] flex items-center gap-2 mt-2">
            <Zap size={12} className="text-indigo-500 fill-indigo-500" /> System Node Alpha
          </p>
        </div>

        <div className="bg-slate-900 border border-white/5 p-1.5 rounded-2xl flex w-full md:w-auto">
          {['Personal', 'Office'].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveDivision(mode)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeDivision === mode 
                  ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Net Liquidity" value={stats.balance} highlight />
        <StatCard label="Total Inflow" value={stats.income} color="text-emerald-400" />
        <StatCard label="Total Outflow" value={stats.expenses} color="text-rose-400" />
      </div>

      {/* 3. FILTERS BAR */}
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl flex flex-wrap items-end gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2 ml-1">
            <Calendar size={12} /> Date Range
          </label>
          <div className="flex items-center bg-black/20 border border-white/5 rounded-xl px-4 py-2 gap-3">
            <input 
              type="date" 
              className="bg-transparent text-white text-[10px] font-bold outline-none [color-scheme:dark]"
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
            <span className="text-slate-600">/</span>
            <input 
              type="date" 
              className="bg-transparent text-white text-[10px] font-bold outline-none [color-scheme:dark]"
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2 ml-1">
            <LayoutGrid size={12} /> Category
          </label>
          <select 
            className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none cursor-pointer hover:bg-black/40 transition-colors"
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">Global (All)</option>
            {['salary', 'food', 'fuel', 'movie', 'loan', 'medical', 'other'].map(cat => (
              <option className='text-black' key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={fetchDashboardData}
          className="bg-white text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 ml-auto"
        >
          Sync Ledger
        </button>
      </div>

      {/* 4. TRANSACTION LEDGER */}
      <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
        
        {/* LEDGER HEADER & TABS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black uppercase italic text-white leading-none">Record Ledger</h3>
            <div className="flex items-center gap-4 mt-4">
              {['all', 'income', 'expense'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab === 'all' ? 'Global' : tab === 'income' ? 'Inflow' : 'Outflow'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {/* LISTING */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <TransactionItem 
                  key={tx._id} 
                  tx={tx} 
                  onEdit={() => handleOpenEdit(tx)} 
                  onDelete={() => confirmDelete(tx._id)} 
                />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex items-center justify-between mt-10 px-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Showing {transactions.length} of {totalRecords} records
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  Prev
                </button>
                <div className="flex items-center px-4 text-[10px] font-black text-indigo-400 bg-indigo-400/10 rounded-xl">
                  {currentPage}
                </div>
                <button
                  disabled={currentPage * recordsPerPage >= totalRecords}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-slate-600 gap-4">
            <Filter size={48} strokeWidth={1} className="opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No records found in this sector</p>
          </div>
        )}
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        onRefresh={fetchDashboardData}
        activeDivision={activeDivision}
        editData={editingTransaction}
      />
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value, color = "text-white", highlight = false }) => (
  <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${highlight ? 'bg-indigo-600/10 border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.1)]' : 'bg-slate-900/40 border-white/5'}`}>
    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">{label}</p>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <IndianRupee size={20} />
      </div>
      <h2 className={`text-3xl md:text-4xl font-black tracking-tighter italic ${color}`}>
        {value.toLocaleString('en-IN')}
      </h2>
    </div>
  </div>
);

// Individual Transaction Row
const TransactionItem = ({ tx, onEdit, onDelete }) => (
  <div className="group flex items-center justify-between p-4 md:p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all">
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
      </div>
      <div>
        <h4 className="font-black text-slate-100 text-sm md:text-base group-hover:text-white transition-colors uppercase tracking-tight italic">{tx.description}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[8px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md">{tx.category}</span>
          {!tx.isEditable && <span className="text-[7px] text-slate-600 font-bold uppercase">Locked</span>}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6 md:gap-12">
      <div className="text-right">
        <p className={`font-black text-lg md:text-xl tracking-tighter ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
        </p>
        <p className="text-[8px] font-bold text-slate-600 uppercase mt-1 tracking-widest">
          {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2 border-l border-white/10 pl-6">
        <button 
          onClick={onEdit}
          disabled={!tx.isEditable}
          className={`p-2.5 rounded-xl transition-all ${
            tx.isEditable 
              ? 'text-indigo-400 hover:bg-indigo-400 hover:text-white' 
              : 'text-slate-800 cursor-not-allowed opacity-30'
          }`}
          title={!tx.isEditable ? "Editing locked after 12h" : "Edit"}
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2.5 text-rose-500/60 hover:text-white hover:bg-rose-600 rounded-xl transition-all"
          title="Purge Record"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;